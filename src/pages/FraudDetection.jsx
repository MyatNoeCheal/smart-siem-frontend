import { useEffect, useState } from 'react';
import { fraudService } from '../services/fraudService';
import FraudStatCard from '../components/fraud/FraudStatCard';
import FraudTrendChart from '../components/fraud/FraudTrendChart';
import FraudSeverityChart from '../components/fraud/FraudSeverityChart';
import AIFraudRiskGauge from '../components/fraud/AIFraudRiskGauge';
import TransactionTable from '../components/fraud/TransactionTable';
import TransactionInvestigationPanel from '../components/fraud/TransactionInvestigationPanel';
import ModelMetricsCard from '../components/fraud/ModelMetricsCard';
import MockDataBadge from '../components/common/MockDataBadge';

export default function FraudDetection() {
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [severity, setSeverity] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMock, setUsingMock] = useState(false);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, trendRes, sevRes, txnRes, metricsRes] = await Promise.all([
        fraudService.getStats(),
        fraudService.getTrend(),
        fraudService.getSeverityDistribution(),
        fraudService.getTransactions({ limit: 50 }),
        fraudService.getModelMetrics(),
      ]);

      setStats(statsRes.data);
      setTrend(trendRes.data);
      setSeverity(sevRes.data);
      setTransactions(txnRes.data.results || []);
      setModelMetrics(metricsRes.data);
      setUsingMock(statsRes.isMock || trendRes.isMock || sevRes.isMock || txnRes.isMock);
    } catch (err) {
      setError('Could not load fraud detection data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleSelectTransaction(txn) {
    const { data } = await fraudService.getTransactionDetail(txn.id);
    setSelectedTxn(data);
  }

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} onRetry={loadAll} />;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100 tracking-wide">
            FRAUD DETECTION
          </h1>
          <p className="text-sm text-slate-400">
            AI-driven transaction risk monitoring
          </p>
        </div>
        {usingMock && <MockDataBadge />}
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <FraudStatCard label="Transactions Analyzed" value={stats?.total_transactions?.toLocaleString() ?? '—'} icon="activity" />
        <FraudStatCard label="Fraud Detected" value={stats?.fraud_detected?.toLocaleString() ?? '—'} icon="alert" tone="critical" />
        <FraudStatCard label="Fraud Rate" value={stats ? `${stats.fraud_rate.toFixed(2)}%` : '—'} icon="percent" tone="warning" />
        <FraudStatCard label="Avg Risk Score" value={stats?.avg_risk_score?.toFixed(1) ?? '—'} icon="gauge" />
        <FraudStatCard label="High-Risk Transactions" value={stats?.high_risk_count?.toLocaleString() ?? '—'} icon="flag" tone="warning" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl bg-slate-900/60 border border-slate-800 p-4 backdrop-blur-sm">
          <h2 className="text-sm font-medium text-slate-300 mb-3">Fraud Trend</h2>
          <FraudTrendChart data={trend} />
        </div>
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 backdrop-blur-sm">
          <h2 className="text-sm font-medium text-slate-300 mb-3">Severity Distribution</h2>
          <FraudSeverityChart data={severity} />
        </div>
      </div>

      {/* Risk gauge + model metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AIFraudRiskGauge score={stats?.avg_risk_score ?? 0} />
        <div className="lg:col-span-2">
          <ModelMetricsCard metrics={modelMetrics} />
        </div>
      </div>

      {/* Transactions table */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 backdrop-blur-sm">
        <h2 className="text-sm font-medium text-slate-300 mb-3">
          Recent Suspicious Transactions
        </h2>
        <TransactionTable
          transactions={transactions}
          onSelect={handleSelectTransaction}
          selectedId={selectedTxn?.id}
        />
      </div>

      {selectedTxn && (
        <TransactionInvestigationPanel
          transaction={selectedTxn}
          onClose={() => setSelectedTxn(null)}
        />
      )}
    </div>
  );
}

function PageLoading() {
  return (
    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
      Loading fraud detection data…
    </div>
  );
}

function PageError({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
      <p className="text-sm">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-1.5 text-xs rounded-md border border-slate-700 hover:border-cyan-500 hover:text-cyan-400 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
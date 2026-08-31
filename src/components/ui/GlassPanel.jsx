import clsx from "clsx";

export default function GlassPanel({ children, className, hoverable = false, ...rest }) {
  return (
    <div
      className={clsx("glass-panel p-5", hoverable && "glass-panel-hover", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
const FeaturePill = ({ children }) => {
  return (
    <li className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 shadow-sm text-justify">
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      <span>{children}</span>
    </li>
  );
};

export default FeaturePill;

const Th = ({ children }: { children: React.ReactNode }) => {
  return (
    <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {children}
    </th>
  );
};

export default Th;

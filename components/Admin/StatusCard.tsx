type Props = {
  title: string;
  value: string;
  color: string;
  icon: string;
};

export default function StatusCard({ title, value, color, icon }: Props) {
  return (
    <div
      className={`${color} rounded-xl p-5 text-white shadow-lg transition hover:scale-[1.02]`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">{value}</h2>
        </div>

        <span className="text-4xl opacity-70">{icon}</span>
      </div>
    </div>
  );
}

type Props = {
  enrolled?: boolean;
};

export default function StatusLayout({ enrolled }: Props) {
  return enrolled ? (
    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
      ✓ Enrolled (18 Units)
    </span>
  ) : (
    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
      ⚠ Pending Encoding
    </span>
  );
}

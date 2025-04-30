/**
 * PageHeader component
 *
 * Displays a centered page title and optional subtitle.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - The main title text to display
 * @param {string} [props.subTitle] - Optional subtitle displayed below the title
 * @returns {JSX.Element} The rendered header
 */
export default function PageHeader({ title, subTitle }) {
  return (
    <div className="mb-4 flex flex-col items-center text-center">
      <h1 className="text-primary font-bold text-3xl">{title}</h1>
      {subTitle && <h2 className="italic text-sm mt-1">{subTitle}</h2>}
    </div>
  );
}

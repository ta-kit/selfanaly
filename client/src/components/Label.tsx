type LabelProps = {
    className?: string;
    children: React.ReactNode;
    htmlFor?: string;
}

const Label:React.FC<LabelProps> = ({ className, children, ...props }) => (
    <label
        className={`${className} block font-medium text-sm text-gray-700`}
        {...props}>
        {children}
    </label>
)

export default Label

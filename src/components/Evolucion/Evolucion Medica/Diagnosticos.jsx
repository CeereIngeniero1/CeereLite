// Diagnosticos.jsx
function Diagnosticos({ id, className, value, onChange, selectedValue, headerTexts, headerType }) {
    return (
        <>
            <h3>
                {selectedValue === '2'
                    ? headerTexts[2][headerType]
                    : headerTexts.default[headerType]}
            </h3>
            <textarea
                id={id}
                className={className}
                value={value}
                onChange={onChange}
            ></textarea>
        </>
    );
}

export default Diagnosticos;

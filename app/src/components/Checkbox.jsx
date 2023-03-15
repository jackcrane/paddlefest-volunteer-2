import { useEffect, useState } from "react";

export const Checkbox = ({ checked, onInput }) => {
  const [checkedState, setCheckedState] = useState(checked);
  const handleChange = () => {
    onInput(!checkedState);
    setCheckedState(!checkedState);
  };
  useEffect(() => {
    console.log(checkedState);
  }, [checkedState]);
  return (
    <input type="checkbox" checked={checkedState} onChange={handleChange} />
  );
};

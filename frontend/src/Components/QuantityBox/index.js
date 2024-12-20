import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";

const QuantityBox = (props) => {
  const [inputVal, setInputval] = useState(props.quantity || 1);
  const MinVal = () => {
    if (inputVal > 1) {
      setInputval(inputVal - 1);
    }
  };
  const PlusVal = () => {
    setInputval(inputVal + 1);
  };

  useEffect(() => {
    props.onQuantityChange(inputVal); // Gửi giá trị số lượng mới về component cha
  }, [inputVal]);

  return (
    <>
      <div className="quantityDrop d-flex align-items-center">
        <Button className="btn-blue btn-lg btn-circle" onClick={MinVal}>
          <FaMinus />
        </Button>
        <input type="text" value={inputVal} />
        <Button className="btn-blue btn-lg btn-circle" onClick={PlusVal}>
          <FaPlus />
        </Button>
      </div>
    </>
  );
};

export default QuantityBox;

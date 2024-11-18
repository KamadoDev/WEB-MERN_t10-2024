import Button from "@mui/material/Button";
import { BsThreeDotsVertical } from "react-icons/bs";
import PropTypes from 'prop-types';

const DashboardBox = (props) => {
  const { color, icon, iconTrending } = props;

  const buttonStyle = {
    background: `linear-gradient(${color[0]}, ${color[1]})`,
  };

  return (
    <>
      <Button className="dashboardBox" style={buttonStyle}>
        <span className="chart">{iconTrending}</span>
        <div className="d-flex w-100">
          <div className="col1">
            <h4 className="text-white mb-0">Total Users</h4>
            <span className="text-white">277</span>
          </div>
          <div className="ml-auto">
            <span className="icon">{icon}</span>
          </div>
        </div>
        <div className="d-flex align-items-center w-100 bottomEle">
          <h6 className="text-white mb-0 mt-0">Last Month</h6>
          <div className="ml-auto">
            <Button className="toggleIcon" >
              <BsThreeDotsVertical/>
            </Button>
          </div>
        </div>
      </Button>
    </>
  );
};


DashboardBox.propTypes = {
  color: PropTypes.arrayOf(PropTypes.string).isRequired,
  icon: PropTypes.node.isRequired,
  iconTrending: PropTypes.node.isRequired,
};

export default DashboardBox;

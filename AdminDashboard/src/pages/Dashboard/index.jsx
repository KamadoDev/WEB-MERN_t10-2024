import DashboardBox from "../../components/DashboardBox";
import { FaCircleUser } from "react-icons/fa6";
import { IoMdTrendingUp } from "react-icons/io";
import { MdTrendingDown } from "react-icons/md";
import { Chart } from "react-google-charts";
import ProductsList from "../../components/Products/ProductsList";

const dataOld = [
  ["Name", "Popularity"],
  ["Cesar", 250],
  ["Rachel", 4200],
  ["Patrick", 2900],
  ["Eric", 8200],
];

const dataNew = [
  ["Name", "Popularity"],
  ["Cesar", 370],
  ["Rachel", 600],
  ["Patrick", 700],
  ["Eric", 1500],
];

export const diffdata = {
  old: dataOld,
  new: dataNew,
};

const Dashboard = () => {
  const data = [
    ["Task", "Hours per Day"],
    ["Work", 9],
    ["Eat", 2],
    ["Commute", 2],
    ["Watch TV", 2],
    ["Sleep", 7],
  ];

  const options = {
    title: "My Daily Activities",
  };

  return (
    <>
      <section className="py-3">
        <div className="dashboardBoxWrapper flex">
          <DashboardBox
            color={["#2c78e5", "#60aff5"]}
            icon={<FaCircleUser />}
            iconTrending={<IoMdTrendingUp />}
          />
          <DashboardBox
            color={["#1da256", "#48d483"]}
            icon={<FaCircleUser />}
            iconTrending={<MdTrendingDown />}
          />
          <DashboardBox
            color={["#e1950e", "#f3cd29"]}
            icon={<FaCircleUser />}
            iconTrending={<MdTrendingDown />}
          />
        </div>

        <ProductsList title="Best Selling Products" isSharedPage={true} />

        <div className="row mt-3">
          <div className="col-md-6">
            <div className="card shadow  p-4 border-0">
              <Chart
                chartType="ColumnChart"
                width="100%"
                height="350px"
                diffdata={diffdata}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow  p-4 border-0">
              <Chart
                chartType="PieChart"
                data={data}
                options={options}
                width={"100%"}
                height={"350px"}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;

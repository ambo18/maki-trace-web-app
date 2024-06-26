import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { onValue, ref } from "firebase/database";
import { db } from "../configs/firebase";
import DoraHomeIcon from "../assets/dora_home_btn.svg";
import L from "leaflet"; 
import earthquakeIcon from "../assets/pins/earthquake_pin.svg";
import fireIcon from "../assets/pins/fire_pin.svg";
import floodIcon from "../assets/pins/flood_pin.svg";
import heavyRainIcon from "../assets/pins/heavy_rain_pin.svg";
import landslideIcon from "../assets/pins/landslide_pin.svg";
import tsunamiIcon from "../assets/pins/tsunami_pin.svg";
import typhoonIcon from "../assets/pins/typhoon_pin.svg";
import volcanicEruptionIcon from "../assets/pins/volcanic_eruption_pin.svg";
import { HiFolder } from "react-icons/hi";
import { FaMapMarked } from "react-icons/fa";
import { IoCloseOutline, IoLogOut } from "react-icons/io5";
import { useAuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Map = () => {
  const [ecData, setEcData] = useState([]);
  const [tempEcData, setTempEcData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [tempReportData, setTempReportData] = useState([]);
  const [current, setCurrent] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuthContext();
  const [defaultCoordinates, setDefaultCoordinates] = useState({ lat: 11.4427, lng: 125.5222 });
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getEvacuationCenters = () => {
    setIsLoading(true);
    const dbRef = ref(db, "/EvacuationCenters");

    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const ec = snapshot.val();
        const ecList = [];
        for (let id in ec) {
          ecList.push({ id, ...ec[id] });
        }
        setEcData(ecList);
        setTempEcData(ecList);
        setIsLoading(false);
      } else {
        console.error("No data");
      }
    });
  };

  const getReports = () => {
    setIsLoading(true);
    const dbRef = ref(db, "/Reports");

    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const reports = snapshot.val();
        const reportsList = [];
        for (let id in reports) {
          reportsList.push({ id, ...reports[id] });
        }
        setReportData(reportsList);
        setTempReportData(reportsList);
        setIsLoading(false);
      } else {
        console.error("No data");
      }
    });
  };

  useEffect(() => {
    getEvacuationCenters();
    getReports();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const iconSwitch = (disasterType) => {
    switch (disasterType) {
      case "Earthquake":
        return L.icon({ iconUrl: earthquakeIcon, iconSize: [50, 50] });
      case "Fire":
        return L.icon({ iconUrl: fireIcon, iconSize: [50, 50] });
      case "Flood":
        return L.icon({ iconUrl: floodIcon, iconSize: [50, 50] });
      case "Heavy Rain":
        return L.icon({ iconUrl: heavyRainIcon, iconSize: [50, 50] });
      case "Landslide":
        return L.icon({ iconUrl: landslideIcon, iconSize: [50, 50] });
      case "Tsunami":
        return L.icon({ iconUrl: tsunamiIcon, iconSize: [50, 50] });
      case "Typhoon":
        return L.icon({ iconUrl: typhoonIcon, iconSize: [50, 50] });
      case "Volcanic Eruption":
        return L.icon({ iconUrl: volcanicEruptionIcon, iconSize: [50, 50] });
      default:
        return L.icon({ iconUrl: DoraHomeIcon, iconSize: [50, 50] });
    }
  };

  const filterSwitch = (filter) => {
    switch (filter) {
      case "all":
        setEcData(tempEcData);
        setReportData(tempReportData);
        toast.success("Now displaying all markers");
        break;
      case "reports":
        setEcData([]);
        setReportData(tempReportData);
        toast.success("Now displaying all disaster report markers");
        break;
      case "ec":
        setEcData(tempEcData);
        setReportData([]);
        toast.success("Now displaying all evacuation center markers");
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-bg-color flex flex-col md:flex-row items-start">
      <aside className="hidden md:flex flex-col justify-between h-screen fixed z-10">
        <div className="h-[80%] w-24 bg-safe-gray rounded-br-2xl outline outline-2 outline-primary-gray">
          <div className="overflow-y-auto py-4 px-4">
            <ul className="space-y-2">
              <li>
                <Link to="/">
                  <img src={DoraHomeIcon} alt="Maki-Trace Home Button" />
                </Link>
              </li>
              <li className="pt-6">
                <Link to="/reports" className="text-secondary-gray transition hover:text-primary-green active:text-secondary-green">
                  <HiFolder className="h-12 w-12 mx-auto " />
                </Link>
              </li>
              <li className="pt-6">
                <Link to="/map" className="text-primary-green transition active:text-secondary-green">
                  <FaMapMarked className="h-12 w-12 mx-auto" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="h-[15%] w-24 bg-safe-gray rounded-tr-2xl outline outline-2 outline-primary-gray">
          <a href="#" onClick={handleLogout} className="text-secondary-gray transition hover:text-primary-green active:text-secondary-green">
            <IoLogOut className="h-12 w-12 mt-8 mx-auto" />
          </a>
        </div>
      </aside>
      <div className="h-screen w-full z-0">
        <MapContainer center={[defaultCoordinates.lat, defaultCoordinates.lng]} zoom={10} style={{ width: "100%", height: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {ecData?.map((evacuationCenter) => (
            <Marker position={[evacuationCenter.latitude, evacuationCenter.longitude]} key={evacuationCenter.id}>
              <Popup>
                <div>
                  <h2>{evacuationCenter.evacuationCenterName}</h2>
                  <p>{evacuationCenter.location}</p>
                </div>
              </Popup>
            </Marker>
          ))}
          {reportData?.map((report) => (
            <Marker
                position={[Number(report.latitude), Number(report.longitude)]}
                key={report.id}
                icon={iconSwitch(report.disasterType)}
                eventHandlers={{
                click: () => setCurrent({ data: report, type: "Report" })
                }}
            >
                <Popup>
                <div>
                    <h2>Disaster Type: {report.disasterType} Report</h2>
                    <p>Report by:{report.fullName}</p>
                    <p>Address: {report.address}</p>
                    <p>Coordinates: {report.latitude}, {report.longitude}</p>
                    <p>Report Date: {report.date}</p>
                    <p>Report Stats: {report.comments} comments</p>
                    <p>Report Description: {report.description}</p>
                </div>
                </Popup>
            </Marker>
            ))}
        </MapContainer>
        {Object.keys(current).length === 0 ? (
          <div className="absolute flex w-screen bottom-[5%] justify-center">
            <h1 className="text-lg font-medium text-secondary-green">Click on a marker to view details</h1>
          </div>
        ) : current?.type === "Evacuation Center" ? (
          <div className="absolute flex w-screen bottom-[5%] justify-center">
            <div className="bg-safe-white p-8 z-10 text-center rounded-2xl shadow-md">
              <div className="flex justify-end -mt-6 -mr-6">
                <IoCloseOutline onClick={() => setCurrent({})} className="h-8 w-8 text-primary-gray cursor-pointer transition hover:text-primary-green active:text-secondary-green" />
              </div>
              <h1 className="text-xl font-medium text-primary-green">
                {current?.data?.evacuationCenterName} <span className="text-primary-gray font-normal">in</span> {current?.data?.city}
              </h1>
              <h2 className="text-sm text-safe-black">{current?.data?.location}</h2>
              <h2 className="text-sm text-primary-gray">
                Coordinates: {current?.data?.latitude}, {current?.data?.longitude}
              </h2>
            </div>
          </div>
        ) : (
          <div className="absolute flex w-screen bottom-[5%] justify-center">
            <div className="bg-safe-white p-8 z-10 text-center rounded-2xl shadow-md">
              <div className="flex justify-end -mt-6 -mr-6">
                <IoCloseOutline onClick={() => setCurrent({})} className="h-8 w-8 text-primary-gray cursor-pointer transition hover:text-primary-green active:text-secondary-green" />
              </div>
              <h1 className="text-xl font-medium text-primary-green">
                {current?.data?.disasterType} Report <span className="font-normal text-primary-gray">by</span> {current?.data?.fullName}
              </h1>
              <h2 className="text-sm text-safe-black">{current?.data?.address}</h2>
              <h2 className="text-sm text-primary-gray">
                Coordinates: {current?.data?.latitude}, {current?.data?.longitude}
              </h2>
              <div className="flex flex-col mt-2">
                <h2 className="text-sm text-safe-black">Report Date: {current?.data?.date}</h2>
                <h2 className="text-sm text-safe-black">
                  Report Stats: {current?.data?.comments} comments
                </h2>
                <h2 className="text-sm text-safe-black">Report Description: {current?.data?.description}</h2>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="bg-safe-gray w-full py-2 flex flex-row md:hidden">
        <ul className="flex flex-row-reverse mx-auto gap-4">
          <li>
            <Link to="/">
              <img src={DoraHomeIcon} alt="Maki-Trace Home Button" className="w-16 h-16" />
            </Link>
          </li>
          <li className="mx-2">
            <Link to="/reports" className="text-secondary-gray transition hover:text-primary-green focus:text-secondary-green">
              <HiFolder className="h-16 w-16 mx-auto " />
            </Link>
          </li>
          <li className="mx-2">
            <Link to="/map" className="text-primary-green transition active:text-secondary-green">
              <FaMapMarked className="h-16 w-16 mx-auto" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Map;

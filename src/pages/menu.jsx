import React, { useState, useEffect, useRef } from "react";
import { FaMapMarked } from "react-icons/fa";
import { HiFolder} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../configs/firebase";
import { onValue, ref } from "firebase/database";
import { useAuthContext } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const Menu = () => {
  // Instantiate AuthContext for use
  const { user } = useAuthContext();

  // Instantiate useNavigate hook for page redirect
  const navigate = useNavigate();

  // State manager
  const [isLoading, setIsLoading] = useState(false);
  const [areThereTokens, setAreThereTokens] = useState(false);

  // Push notif state manager
  const [isSendPushNotifVisible, setIsSendPushNotifVisible] = useState(false);
  const [userTokens, setUserTokens] = useState([]);

  // Get user tokens from realtime database
  const getUserTokens = () => {
    setIsLoading(true);
    const dbRef = ref(db, "/Tokens");

    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const tokens = snapshot.val();
        const tokensList = [];
        for (let id in tokens) {
          tokensList.push(tokens[id].token);
        }

        setUserTokens(tokensList);
        setAreThereTokens(true);
        console.log(tokensList);

        setIsLoading(false);
      } else {
        // If there are no user tokens available
        setAreThereTokens(false);
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    getUserTokens();
  }, []);

  // Close modal handler
  const handleOnClose = () => {
    setIsSendPushNotifVisible(false);
  };

  // Send push notif modal handler
  const handleSendPushNotifModal = () => {
    setIsSendPushNotifVisible(true);
  };

  // Sends a push notif to users via POST HTTP request
  const sendPushNotif = () => {
    console.log("Test");

    const data = {
      registration_ids: userTokens,
      notification: {
        title: pushNotifTitleRef.current.value,
        body: pushNotifBodyTextRef.current.value,
      },
    };

    const url = "https://fcm.googleapis.com/fcm/send";

    if (pushNotifTitleRef.current.value && pushNotifBodyTextRef.current.value) {
      fetch(url, {
        method: "POST",
        headers: {
          Authorization: "key=AAAAVh7Sz58:APA91bHSgorqf8ukz4jLwum0PBulpNHrGtkwr2-d1Pz6PfB3bolhBh28XEjx7b1UCAq98vhOuBwcwdHCmjJDf2yD-ZiDj4TpGtfp3X3SOz4ToJJmRM_6j_PN2n6CP43jcZZdNnjE7nlo",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            toast.success("Push notification successfully sent to mobile application");
          } else {
            toast.info(`Server responded with HTTP ${response.status}`);
          }

          console.log(data);
          // Close modal
          handleOnClose();
        })
        .catch((error) => {
          console.log(error);
          toast.error("An error on sending push notif has occured");
        });
    } else {
      toast.error("Please fill up all input fields");
    }
  };

  // Refs
  const pushNotifTitleRef = useRef();
  const pushNotifBodyTextRef = useRef();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-safe-white md:bg-bg-color">
      <div className="flex flex-col gap-4 bg-safe-white mb-8 px-6 py-6 rounded-2xl w-[400px] md:w-[440px]">
        <div className="flex flex-col">
          <p className="mb-2 text-2xl font-bold text-primary-green text-center">Welcome back to Maki-Trace</p>
          <p className="text-2xl font-bold text-primary-green text-center">Admin!</p>
        </div>
        {/* Menu Items */}
        <Link to="/reports" className="w-full rounded-xl p-2 bg-safe-gray cursor-pointer shadow-md transition border border-secondary-gray hover:shadow-xl hover:bg-secondary-gray">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p className="text-secondary-green text-xl font-bold">Manage Reports</p>
              <p className="text-base text-primary-gray">Validate the integrity of the reports</p>
            </div>
            <HiFolder className="h-8 w-8 my-auto text-secondary-green" />
          </div>
        </Link>
        <Link to="/map" className="w-full rounded-xl p-2 bg-safe-gray cursor-pointer shadow-md transition border border-secondary-gray hover:shadow-xl hover:bg-secondary-gray">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p className="text-secondary-green text-xl font-bold">View Map</p>
              <p className="text-base text-primary-gray">Check the status of the map</p>
            </div>
            <FaMapMarked className="h-8 w-8 my-auto text-secondary-green" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Menu;

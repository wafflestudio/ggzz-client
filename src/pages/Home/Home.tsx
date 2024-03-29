import styles from "./Home.module.scss";
import { useCallback, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import NavigationTab from "components/Home/NavigationTab";
import SplashScreen from "components/Home/SplashScreen";
import Map from "components/Home/Map/Map";
import { apiGetLetters, useApiData } from "apis/apis";
import { useMyPositionStore } from "store/useMyPositionStore";
import sendIcon from "assets/icon/Home/SendButton/send.svg";
import useEtcStore from "store/useEtcStore";
const Home = () => {
  const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = useState(15); // initial zoom
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>({
    lat: 37.46474,
    lng: 126.954547,
  });

  const myPosition = useMyPositionStore((state) => state.currentCoordinates);
  const viewPosition = useMyPositionStore((state) => state.viewCoordinates);
  const setViewPosition = useMyPositionStore(
    (state) => state.setViewCoordinates,
  );
  const navigate = useNavigate();

  const currentLLCoordinates = useCallback(() => {
    if (viewPosition) return viewPosition;
    if (myPosition) {
      setCenter(myPosition);
      return myPosition;
    }
    return null;
  }, [myPosition, viewPosition]);

  const letters = useApiData<
    {
      id: number;
      createdAt: string;
      createdBy: string;
      title: string;
      summary: string;
      longitude: number;
      latitude: number;
    }[]
  >(
    () => {
      const currentLL = currentLLCoordinates();
      if (!currentLL) return Promise.resolve([]);
      const { lat, lng } = currentLL;
      return apiGetLetters(lng, lat);
    },
    [],
    [myPosition, viewPosition],
  );

  const render = useCallback(
    (status: Status) => {
      if (status === Status.FAILURE) return <h3>{status} ...</h3>;
      return <h3>{status} ..</h3>;
    },
    [center],
  );

  const onClick = useCallback((e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    if (!e.latLng) return;
    setClicks([...clicks, e.latLng]);
  }, []);

  const onIdle = useCallback((m: google.maps.Map) => {
    const bounds = m.getBounds();
    if (!bounds) return;
    const newCenter = m.getCenter()?.toJSON();
    if (!newCenter) return;
    setZoom(m.getZoom() ?? 10);
    setCenter(newCenter);
    setViewPosition(newCenter);
  }, []);

  // show splash screen for first 4 seconds
  // isLoading === true: splash screen
  const isLoading = useEtcStore((state) => state.isLoading);
  const check = useEtcStore((state) => state.check);
  useLayoutEffect(() => {
    if (isLoading)
      setTimeout(() => {
        check();
      }, 4000);
  }, [check]);

  return (
    <>
      {isLoading && (
        <div className={styles["splash-screen-container"]}>
          <SplashScreen />
        </div>
      )}
      <div className={styles["home"]}>
        <NavigationTab />
        <>
          <Wrapper
            apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY || ""}
            version="beta"
            libraries={["marker"]}
            render={render}
          >
            <Map
              center={center}
              onClick={onClick}
              onIdle={onIdle}
              zoom={zoom}
              letters={letters}
              className={styles["map"]}
            />
          </Wrapper>
        </>
        <button
          className={styles["send"]}
          onClick={() => {
            navigate("send");
          }}
        >
          <img src={sendIcon} />
        </button>
      </div>
    </>
  );
};

export default Home;

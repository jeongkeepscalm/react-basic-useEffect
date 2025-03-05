import { useRef, useState, useEffect } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

const selectedIdsOfPlaces = JSON.parse(localStorage.getItem("selectdPlaces") || []);
const storedPlaces = AVAILABLE_PLACES.filter((place) => selectedIdsOfPlaces.includes(place.id));

function App() {

  const modal = useRef();
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  /*
    useEffect(a,b)  | a: 함수  | b: 배열
      컴포넌트가 렌더링된 후에 실행되는 함수
      두 번째 인자로 전달된 배열의 값이 변경될 때만 함수가 실행된다.
      남용 x
  */
  useEffect(() => {
    // navigator: 브라우저가 제공하는 API로, 사용자의 위치 정보를 가져올 수 있다.
    navigator.geolocation.getCurrentPosition((position) => {

      // 현재 위치를 기준으로 하여 가까운 이미지순으로 정렬한다. 
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,   // 위도
        position.coords.longitude   // 경도
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, []); // 추가적인 의존성이 없어서 빈 배열을 전달한다.

  /*
    useState로 상태관리 가능하므로 useEffect 필요 x
    useEffect(() => {
      로컬스토리지에 저장된 선택된 사진을 불러온다.
      const selectedIdsOfPlaces = JSON.parse(localStorage.getItem("selectdPlaces") || []);
      const storedPlaces = AVAILABLE_PLACES.filter((place) => selectedIdsOfPlaces.includes(place.id));
      setPickedPlaces(storedPlaces);
    }, [])`
  */

  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  // 사진 추가 함수
  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      // 같은 사진을 선택하면 추가하지 않는다.
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }

      // 선택한 사진을 추가한다.
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    // 선택된 사진을 로컬스토리지에 저장한다. 
    const sortedIds = JSON.parse(localStorage.getItem("selectdPlaces")) || [];
    if (sortedIds.indexOf(id) === -1) {
      localStorage.setItem("selectdPlaces", JSON.stringify([ id, ...sortedIds]));
    }

  }

  // 사진 제거 함수
  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalIsOpen(false);

    // 선택된 사진을 로컬스토리지에서 제거한다.
    const storedIds = JSON.parse(localStorage.getItem("selectdPlaces")) || [];
    localStorage.setItem("selectdPlaces", JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current)));
  }

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText={"Sorting places by distance..."}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;

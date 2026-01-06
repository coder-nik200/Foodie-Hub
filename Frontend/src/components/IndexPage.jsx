import FirstPage from "../pages/FirstPage";
import FoodOptions from "./FoodOptions";
import SweetData from "./SweetData";
import ViewAllHits from "./ViewAllHits";
import Drinks from "./Drinks";
import SpotLight from "./Spotlight";
import Testimonials from "./Testimonials";

const IndexPage = () => {
  return (
    <>
      <FirstPage />
      <FoodOptions />
      <ViewAllHits />
      <SweetData />
      <Drinks />
      <SpotLight />
      <Testimonials />
    </>
  );
};

export default IndexPage;

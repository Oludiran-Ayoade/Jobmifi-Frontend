import HeroSection from "../components/HeroSection";
import CompanySlider from "./Company/CompanySlider";
import JobCategoryComponent from "./Jobs/AllJobs";
import Newsletter from "./Newsletter";


const IntroHome = () => {
  return (
    <>
    <HeroSection />
    <JobCategoryComponent />
    <CompanySlider />
    <Newsletter />
    </>
  )
}

export default IntroHome
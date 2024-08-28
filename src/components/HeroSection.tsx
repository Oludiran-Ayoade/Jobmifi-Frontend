import { GiWorld } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";
import ipsum from "../assets/herosection/ipsum.png"
import ips from "../assets/herosection/ips.png"
import corporate from "../assets/herosection/corporate.jpg"


const HeroSection = () => {
  return (
    <>
    <div className="hero">
    <div className="herosection">
        <div>
        <h1>Find the perfect <br /> job for you</h1>
        <p>Search your career opportunity through 12,800 jobs</p>

    <div className="inputbox">
        <div className="input_section shadow-lg">
        <input type="text" placeholder="Job Title or Keyword" />
        <input type="text"  placeholder="All Locations"/>
        </div>
        
        <GiWorld  className="world_icon"/>
        <button className="search_btn"><FaSearch className="search_button"/></button>
        </div>

        <div className="popular_section">
            <h3>Popular Searches</h3>
        <div className="popular_search">
        <button>designer</button>
            <button>Writer</button>
            <button>Web</button>
            <button>software</button>
            <button>Financial Analyst</button>
            <br />
            <button>Fullstack</button>
            <button>Construction</button>
            <button>Data Analyst</button>
            <button>HR</button>
            {/* <br />
            <button>Technical Writing</button> */}
        </div>
        </div>

        <div className="sponsors">
          <img src={ipsum} alt="sponsors" />
          <img src={ips} alt="sponsors" />
          <img src={ipsum} alt="sponsors" />
          <img src={ips} alt="sponsors" />
        </div>

        </div>

        <div className="hero_section_ii">
            <div className="color_box"></div>
            <div className="color_box_ii"></div>
            <div><img src={corporate} alt="" /></div>
            <div></div>
        </div>
        </div>
    </div>
    </>
  )
}

export default HeroSection
import React, { useEffect, useState } from "react";
import { FaInstagram, FaGithub, FaFacebook, FaYoutube } from "react-icons/fa6";
import { IoIosWarning } from "react-icons/io";
import { Rain } from "react-rainfall";
import AOS from "aos";
import "aos/dist/aos.css";

const key = "4b1346e05c454469b51113630231012";

function App() {
  const [cityDetails, setCityDetails] = useState(null);
  const [city, setCity] = useState("London");
  const [currentDay, setCurrentDay] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorForm, setErrorForm] = useState(false);

  const currentDayFinal = cityDetails
    ? cityDetails.forecast.forecastday[currentDay]
    : "";
  const allDays = cityDetails ? cityDetails.forecast.forecastday : [];

  const month = new Date(currentDayFinal.date).toLocaleString("default", {
    month: "short",
  });
  const day = new Date(currentDayFinal.date).getDate();

  return (
    <div>
      <Header
        onCityDetails={setCityDetails}
        city={city}
        setCity={setCity}
        setIsLoading={setIsLoading}
        setErrorForm={setErrorForm}
      />
      <SecondHeader city={city} />
      <SelectedDayAllInfo
        currentDay={currentDayFinal}
        isLoading={isLoading}
        errorForm={errorForm}
      >
        {" "}
        <WeatherDay month={month} day={day} />
      </SelectedDayAllInfo>
      <WeatherAllDays
        allDays={allDays}
        setCurrentDay={setCurrentDay}
        errorForm={errorForm}
      />
      <Footer />
    </div>
  );
}

function Header({ onCityDetails, city, setCity, setIsLoading, setErrorForm }) {
  useEffect(
    function () {
      async function fetchWeather() {
        try {
          setErrorForm(false);
          setIsLoading(true);
          const res = await fetch(
            `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=5`
          );
          if (!res.ok)
            throw new Error("Something went wrong with fetching weather");

          const data = await res.json();
          const currentWeather = data;
          onCityDetails(currentWeather);
        } catch (err) {
          setErrorForm(true);
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
      if (city.length > 3) fetchWeather();
    },
    [city, onCityDetails, setIsLoading, setErrorForm]
  );

  return (
    <header className="header__primary">
      <h1 className="heading-primary">
        <span className="heading-primary--main">Welcome</span>
        <span className="heading-primary--sub">to my weather app</span>
      </h1>

      <div class="form__field margin-top-medium">
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          type="input"
          placeholder="Enter your city"
          className="header__primary-input"
          name="name"
          id="name"
        />
        <label for="name" class="form__label">
          Enter you city
        </label>
      </div>
    </header>
  );
}

function Loader() {
  return <div class="lds-dual-ring"></div>;
}

function SnowfallAnimation() {
  return (
    <div class="snowflakes" aria-hidden="true">
      <div class="snowflake">❅</div>
      <div class="snowflake">❅</div>
      <div class="snowflake">❆</div>
      <div class="snowflake">❄</div>
      <div class="snowflake">❅</div>
      <div class="snowflake">❆</div>
      <div class="snowflake">❄</div>
      <div class="snowflake">❅</div>
      <div class="snowflake">❆</div>
      <div class="snowflake">❄</div>
    </div>
  );
}

function ErrorHandling({ children }) {
  return (
    <div className="error">
      <h1 className="error-text">
        <span className="error-text-sign">
          <IoIosWarning />
        </span>
        {children}
      </h1>
    </div>
  );
}

function SecondHeader({ city }) {
  return (
    <div>
      <h2 className="heading__secondary">
        <span className="heading__secondary--main">Current weather for</span>
        <span className="heading__secondary--sub">{city ? city : ""}</span>
      </h2>
    </div>
  );
}

function WeatherDay({ month, day }) {
  return (
    <div className="display-flex selected__day-calendar">
      <i className="icon-basic-calendar"></i>
      <h3 className="center">
        {day} {month}
      </h3>
    </div>
  );
}

function WeatherMiniInfo({ currentDay }) {
  return (
    <div className="selected__day--flex">
      <img
        className="selected__day-main-cloud"
        src={currentDay ? currentDay.day.condition.icon : ""}
        alt={currentDay ? currentDay.day.condition.text : ""}
      ></img>
      <div className="selected__day--degrees">
        <span>
          {currentDay ? currentDay.day.avgtemp_c : "21"}
          <i>&#8451;</i>
        </span>
        <span> {currentDay ? currentDay.day.condition.text : "sunny"}</span>
      </div>
    </div>
  );
}

function SelectedDayMainInfo({ currentDay }) {
  const chanceOfPrecipitationSnow =
    currentDay && currentDay.day.avgtemp_c < 1
      ? currentDay.day.daily_chance_of_snow
      : 0;
  const chanceOfPrecipitationRain =
    currentDay && currentDay.day.avgtemp_c > 1
      ? currentDay.day.daily_chance_of_rain
      : 0;
  const chanceOfPrecipitationTitle =
    currentDay && currentDay.day.avgtemp_c < 1 ? "Snowfall" : "Rainfall";
  return (
    <div className={"selected__day--grid"}>
      <GridKids>
        Max C<span>{currentDay ? currentDay.day.maxtemp_c : "23"}</span>
      </GridKids>
      <GridKids>
        Humidity<span>{currentDay ? currentDay.day.avghumidity : "23"}%</span>
      </GridKids>
      <GridKids>
        Wind
        <span>{currentDay ? currentDay.day.maxwind_kph : "23"} km/h</span>
      </GridKids>
      <GridKids>
        Min C <span>{currentDay ? currentDay.day.mintemp_c : "23"}</span>
      </GridKids>
      <GridKids>
        {chanceOfPrecipitationTitle}
        <span>{chanceOfPrecipitationRain || chanceOfPrecipitationSnow}%</span>
      </GridKids>
      <GridKids>
        Precip <span>{currentDay ? currentDay.day.totalprecip_mm : "23"}</span>
      </GridKids>
    </div>
  );
}

function SelectedDayAllInfo({ children, currentDay, isLoading, errorForm }) {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section className="selected__day">
      {currentDay && currentDay.day.daily_chance_of_snow > 30 ? (
        <SnowfallAnimation />
      ) : (
        ""
      )}
      {currentDay && currentDay.day.daily_chance_of_rain > 30 ? <Rain /> : ""}

      <div className="selected__day-main" data-aos="fade-up">
        {errorForm ? (
          <ErrorHandling>Enter an existing city</ErrorHandling>
        ) : (
          <>
            <div className="selected__day-header">
              {children} <WeatherMiniInfo currentDay={currentDay} />
            </div>
            <div className="selected__day-body">
              {isLoading ? (
                <Loader />
              ) : (
                <SelectedDayMainInfo currentDay={currentDay} />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function WeatherAllDays({ allDays, setCurrentDay, errorForm }) {
  function handleClick(i) {
    setCurrentDay(i);
  }

  return (
    <div className="main__weather">
      {allDays.map((day, i) => (
        <FlexBoxKids
          key={i}
          day={day}
          index={i}
          handleClick={handleClick}
          errorForm={errorForm}
        />
      ))}
    </div>
  );
}

function GridKids({ children }) {
  return <div className="selected__day--grid-kids">{children}</div>;
}

function FlexBoxKids({ day, index, handleClick, errorForm }) {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  const renderAnimation = index => {
    if (index === 0) return "fade-right";
    if (index === 4) return "fade-left";
    if (index >= 1 && index <= 3) return "fade-up";
  };
  const dayWeek = new Date(day.date).getDate();
  const month = new Date(day.date).toLocaleString("default", {
    month: "short",
  });

  return (
    <div
      className="flex__box-kid"
      onClick={() => handleClick(index)}
      data-aos={renderAnimation(index)}
    >
      {errorForm ? (
        <ErrorHandling></ErrorHandling>
      ) : (
        <>
          <div className="padding">
            <div className="flex__box-kid-day">
              <img src={day.day.condition.icon} alt={day.day.condition.text} />
              <h4 className="flex__box-kid-date">
                <span>{month}</span> <span>{dayWeek}</span>
              </h4>
            </div>
            <hr></hr>
            <div className="flex__box-kid-temp">
              <span>
                {day.day.avgtemp_c} <i>&#8451;</i>
              </span>
              <span>
                {day.day.daily_chance_of_rain
                  ? day.day.daily_chance_of_rain
                  : day.day.daily_chance_of_snow}
                %
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-row">
        <span className="footer-row-icon">
          <FaInstagram />
        </span>
        <span className="footer-row-icon">
          <FaFacebook />
        </span>
        <span className="footer-row-icon">
          <FaGithub />
        </span>
        <span className="footer-row-icon">
          <FaYoutube />
        </span>
      </div>
      <div className="footer-row">
        <span className="footer-text">Contact us</span>
        <span className="footer-text">Our Services</span>
        <span className="footer-text">Privacy Policy</span>
        <span className="footer-text">Terms & Conditions</span>
        <span className="footer-text">Career</span>
      </div>
    </footer>
  );
}

export default App;

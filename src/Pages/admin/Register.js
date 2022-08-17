import React from "react";
import css from "./styles/Register.module.css";
import { useForm } from "react-hook-form";
import { useAuth0 } from "@auth0/auth0-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faIdBadge, faImagePortrait, faMobileScreen, faAt, faUnlock, faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons";

export default function Register() {
  const { register, handleSubmit } = useForm();
  const { loginWithRedirect } = useAuth0();

  const onSubmit = (data) => {
    console.log(JSON.stringify(data));
    fetch("http://localhost:4300/api?class=admin&action=create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log(response.message);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return;
      })
      .catch((error) => {
        console.error("There has been a problem with your fetch operation:", error);
      });
  };

  return (
    <div className={css.register}>
      <section>
        <h2>Nový uživatel</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={css.input_box}>
            <input type="text" placeholder="Uživatelské jméno" {...register("username")} />
            <FontAwesomeIcon className={css.icon} icon={faUser} />
          </div>

          <div className={css.input_box}>
            <input type="text" placeholder="Jméno" {...register("fname")} />
            <FontAwesomeIcon className={css.icon} icon={faImagePortrait} />
          </div>

          <div className={css.input_box}>
            <input type="text" placeholder="Příjmení" {...register("lname")} />
            <FontAwesomeIcon className={css.icon} icon={faIdBadge} />
          </div>

          <div className={css.input_box}>
            <input type="phone" placeholder="Telefon" {...register("tel")} />
            <FontAwesomeIcon className={css.icon} icon={faMobileScreen} />
          </div>

          <div className={css.input_box}>
            <input type="email" placeholder="Email" {...register("email")} />
            <FontAwesomeIcon className={css.icon} icon={faAt} />
          </div>

          <div className={css.input_box}>
            <input type="password" placeholder="Heslo" {...register("password")} />
            <FontAwesomeIcon className={css.icon} icon={faUnlock} />
          </div>

          <div className={css.input_box}>
            <input type="password" placeholder="Heslo znovu" {...register("password_check")} />
            <FontAwesomeIcon className={css.icon} icon={faLock} />
          </div>

          <div className={css.input_box}>
            <select defaultValue={"default"} {...register("privilege")}>
              <option value="default" disabled>
                -- Práva nového účtu --
              </option>
              <option value="1">Uživatel</option>
              <option value="2">Zaměstnanec</option>
              <option value="3">Admin</option>
            </select>
            <FontAwesomeIcon className={css.icon} icon={faArrowUpWideShort} />
          </div>
          <button
            onClick={() => {
              loginWithRedirect();
            }}
          >
            Log in
          </button>

          <input type="submit" />
        </form>
      </section>
    </div>
  );
}

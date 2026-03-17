# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* ruby version: 3.3.5 
  rails 8.1.2

Steps:


rails new todo_app -d postgresql -j esbuild --css tailwind
cd todo_app
yarn add react react-dom
In app/controllers/todos_controller.rb, set up the logic to handle JSON requests:

3. Frontend: React Components
4. Connecting the Two
5. rails generate controller Home index
6. Update config/routes.rb:

In app/views/home/index.html.erb, add the mounting point
<div id="root"></div>

7. Create file: 
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

rails generate authentication

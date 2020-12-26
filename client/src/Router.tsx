import React, { memo } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login">
          {/*<Login />*/}
          login
        </Route>
        <Route path="/editor">
          editor
          {/*<Editor />*/}
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default memo(Router);

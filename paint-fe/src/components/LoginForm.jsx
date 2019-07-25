import React from "react";

export default class LoginForm extends React.Component {
    render() {
        return (
            <form method="post" action="/login">
                <input name="username" placeholder="username" />
                <input type="password" name="password" placeholder="password" />
                <input type="hidden" name="next_url" value="{{next_url}}" />
                <input type="submit" value="signup/login" />
            </form>)
    }
}
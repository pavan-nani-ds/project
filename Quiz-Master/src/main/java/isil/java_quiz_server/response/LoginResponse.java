package isil.java_quiz_server.response;

import isil.java_quiz_server.modal.User;

public class LoginResponse {
    private User user;
    private boolean authenticated;

    public LoginResponse(User user, boolean authenticated) {
        this.user = user;
        this.authenticated = authenticated;
    }

    public User getUser() {
        return user;
    }

    public boolean isAuthenticated() {
        return authenticated;
    }
}

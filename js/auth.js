/**
 * FRCC STAYS - Authentication Module
 * NOTE: This is a minimal placeholder. Replace with team's real Sign up / Sign in screens.
 * Uses localStorage for demo purposes only.
 */

const Auth = {
  USER_KEY: 'frcc_user',
  USERS_KEY: 'frcc_users',

  /**
   * Get all registered users
   */
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.USERS_KEY)) || [];
    } catch {
      return [];
    }
  },

  /**
   * Save users array to localStorage
   */
  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },

  /**
   * Register a new user
   */
  register(name, email, mobile, password) {
    const users = this.getUsers();
    
    // Check if email or mobile already registered
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email already registered' };
    }
    if (users.find(u => u.mobile === mobile)) {
      return { success: false, error: 'Mobile number already registered' };
    }

    const user = {
      id: 'user_' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      password: password, // In production, this would be hashed server-side
      createdAt: new Date().toISOString()
    };

    users.push(user);
    this.saveUsers(users);
    
    // Auto-login after registration
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(this.USER_KEY, JSON.stringify(userWithoutPassword));
    
    return { success: true, user: userWithoutPassword };
  },

  /**
   * Sign in with email/mobile and password
   */
  login(identifier, password) {
    const users = this.getUsers();
    const user = users.find(u => 
      (u.email.toLowerCase() === identifier.toLowerCase() || u.mobile === identifier) &&
      u.password === password
    );

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(this.USER_KEY, JSON.stringify(userWithoutPassword));
    
    return { success: true, user: userWithoutPassword };
  },

  /**
   * Get currently logged in user
   */
  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(this.USER_KEY));
    } catch {
      return null;
    }
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  /**
   * Sign out current user (clears session only, not user data)
   */
  logout() {
    localStorage.removeItem(this.USER_KEY);
  },

  /**
   * Get initials for avatar display
   */
  getInitials(name) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
};

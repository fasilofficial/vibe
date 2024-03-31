import { differenceInYears, parse } from "date-fns";

const validateForm = (formData, registerForm) => {
  for (const key in formData) {
    if (key !== "emailVerified") {
      if (!formData[key]) {
        throw new Error(`Please fill in all fields`);
      }
    }
  }

  // Validate email format
  if (formData.email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      throw new Error(`Please enter a valid email address`);
    }
  }

  if (formData.newPassword) {
    const password = formData.newPassword;
    if (password.length < 8) {
      throw new Error(`Password must be at least 8 characters long`);
    }
  }

  if (registerForm) {
    if (formData.userName) {
      // Validate username format
      const usernamePattern = /^[a-zA-Z0-9_]+$/;
      if (!usernamePattern.test(formData.userName)) {
        throw new Error(
          `Username can only contain letters, numbers, and underscores`
        );
      }
    }

    // Validate password strength
    if (formData.password) {
      const password = formData.password;
      if (password.length < 8) {
        throw new Error(`Password must be at least 8 characters long`);
      }
    }

    // Validate password match
    if (formData.password && formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        throw new Error(`Passwords do not match`);
      }
    }

    if (formData.dob) {
      const dobDate = parse(formData.dob, "yyyy-MM-dd", new Date());
      const age = differenceInYears(new Date(), dobDate);

      // Validate age
      if (age < 13) {
        throw new Error(`You must be at least 13 years old to register`);
      }
    }

    if (formData.emailVerified === false)
      throw new Error(`Please verify the email to continue`);
  }

  return true;
};

export default validateForm;

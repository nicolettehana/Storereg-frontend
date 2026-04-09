// import { useEffect, useRef, useState } from "react";
// import {
//   Box,
//   Button,
//   Divider,
//   Heading,
//   Link,
//   Stack,
//   Text,
//   useDisclosure,
//   useToast,
// } from "@chakra-ui/react";
// import { Form, Formik } from "formik";
// import * as yup from "yup";
// import InputField from "../../components/core/formik/InputField";
// import PasswordField from "../../components/core/formik/PasswordField";
// import { Link as RouterLink, useNavigate } from "react-router-dom";
// import {
//   useAuthenticateUser,
//   useFetchRefreshCaptcha,
//   useGetPublicKey,
// } from "../../hooks/authQueries";
// import { encryptRSA } from "../../components/utils/security";
// import CaptchaImage from "../../components/common/CaptchaImage";
// import OTPForm from "./OTPForm";
// import { useAuthContext } from "../../components/auth/authContext";

// const SignInForm = () => {
//   // Hooks
//   const formikRef = useRef();
//   const toast = useToast();
//   const navigate = useNavigate();

//   // ** Comment this later **
//   // const [token, setToken] = useState("");
//   // const otpDisclosure = useDisclosure();
//   const { refreshUser } = useAuthContext();

//   // Queries
//   const publicKeyQuery = useGetPublicKey();
//   const captchaQuery = useFetchRefreshCaptcha();
//   const authenticateQuery = useAuthenticateUser(
//     async (response) => {
//       // ** Uncomment this later **
//       localStorage.setItem("access_token", response.data.access_token);
//       localStorage.setItem("refresh_token", response.data.refresh_token);
//       //localStorage.setItem("role", response.data.role);

//       // ** Comment this later
//       // setToken(response.data.body.otpToken);
//       // otpDisclosure.onOpen();
//       // toast({
//       //   isClosable: true,
//       //   duration: 3000,
//       //   position: "top-right",
//       //   status: "success",
//       //   title: "Success",
//       //   description: response.data.body.message,
//       // });

//       await refreshUser();

//       switch (response.data.role) {
//         case "USER":
//           navigate("/user/dashboard");
//           break;
//         case "ISS":
//           navigate("/issue/dashboard");
//           break;
//         case "PUR":
//           navigate("/purchase/dashboard");
//           break;
//         case "ADMIN":
//           navigate("/admin/logs");
//         case "SAD":
//           navigate("/sad/dashboard");
//           break;
//         case "PURNS":
//           navigate("/purns/purchase");
//           break;
//         default:
//           break;
//       }

//       return response;
//     },
//     (error) => {
//       // Refresh Captcha
//       captchaQuery.refetch();
//       formikRef.current.setFieldValue("captcha", "");

//       toast({
//         isClosable: true,
//         duration: 3000,
//         position: "top-right",
//         status: "error",
//         title: "Error",
//         description: error.response.data.detail,
//       });
//       return error;
//     },
//   );

//   // Formik
//   const initialValues = {
//     username: "",
//     password: "",
//     captcha: "",
//     captchaToken: "",
//   };

//   const validationSchema = yup.object({
//     username: yup
//       .string()
//       //.matches(/^\d{10}$/, "Please enter a valid mobile number")
//       .required("Username is required"),
//     password: yup
//       .string()
//       .matches(/(?=.*[a-z])/, "At least 1 lowercase letter")
//       .matches(/(?=.*[A-Z])/, "At least 1 uppercase letter")
//       .matches(/(?=.*\d)/, "At least 1 number")
//       .matches(/(?=.*[#^@$!%*?&])/, "At least 1 special character")
//       .min(8, "Password must be between 8 to 255 characters")
//       .max(255, "Password must be between 8 to 255 characters")
//       .required("Password is required"),
//     captcha: yup.string().required("Captcha is required"),
//     captchaToken: yup.string().required("Captcha token is required"),
//   });

//   const onSubmit = (values) => {
//     const publicKey = publicKeyQuery?.data?.data?.publicKey;
//     const formData = { ...values };

//     formData.username = encryptRSA(formData.username, publicKey);
//     formData.password = encryptRSA(formData.password, publicKey);
//     authenticateQuery.mutate(formData);
//   };

//   useEffect(() => {
//     if (captchaQuery.isSuccess) {
//       formikRef.current.setFieldValue(
//         "captchaToken",
//         captchaQuery?.data?.data?.captchaToken,
//       );
//     }
//   }, [captchaQuery?.data?.data?.captchaToken]);

//   return (
//     <>
//       {/* Comment this later */}
//       {/* <OTPForm
//         isOpen={otpDisclosure.isOpen}
//         onClose={otpDisclosure.onClose}
//         token={token}
//         values={formikRef.current?.values}
//       /> */}

//       <Formik
//         innerRef={formikRef}
//         initialValues={initialValues}
//         validationSchema={validationSchema}
//         onSubmit={onSubmit}
//       >
//         {(formik) => (
//           <Stack as={Form} spacing={4}>
//             <Stack>
//               <Heading size="md">Login</Heading>
//             </Stack>

//             <InputField
//               type="text"
//               name="username"
//               label="Username"
//               autoComplete="off"
//               placeholder="Enter your username"
//             />

//             <Box pos="relative">
//               <PasswordField
//                 name="password"
//                 label="Password"
//                 placeholder="Minimum 8 characters"
//               />

//               {/* <Link
//                 as={RouterLink}
//                 to="/auth/forgot-password"
//                 pos="absolute"
//                 top={0}
//                 right={0}
//               >
//                 Forgot Password?
//               </Link> */}
//             </Box>

//             <CaptchaImage query={captchaQuery} />

//             <InputField
//               name="captcha"
//               label="Captcha"
//               placeholder="Enter the captcha above"
//             />

//             <Button
//               type="submit"
//               variant="brand"
//               isLoading={authenticateQuery.isPending}
//               loadingText="Loading"
//               isDisabled={!formik.values.captchaToken} // ✅
//             >
//               Sign In
//             </Button>

//             <Divider />

//             {/* <Text>
//               Don't have an account?{" "}
//               <Link as={RouterLink} to="/auth/register">
//                 Register
//               </Link>{" "}
//               now.
//             </Text> */}
//           </Stack>
//         )}
//       </Formik>
//     </>
//   );
// };

// export default SignInForm;

import { useEffect, useRef } from "react";
import {
  Box,
  Button,
  Divider,
  Heading,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as yup from "yup";
import InputField from "../../components/core/formik/InputField";
import PasswordField from "../../components/core/formik/PasswordField";
import { useNavigate } from "react-router-dom";
import {
  useAuthenticateUser,
  useFetchRefreshCaptcha,
  useGetPublicKey,
} from "../../hooks/authQueries";
import { encryptRSA } from "../../components/utils/security";
import CaptchaImage from "../../components/common/CaptchaImage";
import { useAuthContext } from "../../components/auth/authContext";

const SignInForm = () => {
  const formikRef = useRef();
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuthContext();

  // Queries
  const publicKeyQuery = useGetPublicKey();
  const captchaQuery = useFetchRefreshCaptcha();

  const authenticateQuery = useAuthenticateUser(
    async (response) => {
      const { access_token, refresh_token, role } = response.data;

      // ✅ Store tokens via context
      login(access_token, refresh_token, { role });

      toast({
        title: "Login successful",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });

      // ✅ Role-based navigation (same style as first)
      switch (role) {
        case "USER":
          navigate("/user/dashboard", { replace: true });
          break;
        case "ISS":
          navigate("/issue/dashboard", { replace: true });
          break;
        case "PUR":
          navigate("/purchase/dashboard", { replace: true });
          break;
        case "ADMIN":
          navigate("/admin/logs", { replace: true });
          break;
        case "SAD":
          navigate("/sad/dashboard", { replace: true });
          break;
        case "PURNS":
          navigate("/purns/purchase", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
      }
    },
    (error) => {
      // ✅ Refresh captcha + reset field
      captchaQuery.refetch();
      formikRef.current?.setFieldValue("captcha", "");

      toast({
        title: "Login failed",
        description: error?.response?.data?.detail || "Something went wrong",
        status: "error",
        position: "top-right",
        duration: 4000,
        isClosable: true,
      });
    },
  );

  // Formik setup
  const initialValues = {
    username: "",
    password: "",
    captcha: "",
    captchaToken: "",
  };

  const validationSchema = yup.object({
    username: yup.string().required("Username is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(255, "Password must be at most 255 characters")
      .matches(/(?=.*[a-z])/, "At least 1 lowercase letter")
      .matches(/(?=.*[A-Z])/, "At least 1 uppercase letter")
      .matches(/(?=.*\d)/, "At least 1 number")
      .matches(/(?=.*[#^@$!%*?&])/, "At least 1 special character")
      .required("Password is required"),
    captcha: yup.string().required("Captcha is required"),
    captchaToken: yup.string().required("Captcha token is required"),
  });

  const onSubmit = (values) => {
    const publicKey = publicKeyQuery?.data?.data?.publicKey;
    if (!publicKey) return;

    const formData = {
      username: encryptRSA(values.username, publicKey),
      password: encryptRSA(values.password, publicKey),
      captcha: values.captcha,
      captchaToken: values.captchaToken,
    };

    authenticateQuery.mutate(formData);
  };

  // ✅ Set captcha token
  useEffect(() => {
    if (captchaQuery.isSuccess && captchaQuery.data?.data?.captchaToken) {
      formikRef.current?.setFieldValue(
        "captchaToken",
        captchaQuery.data.data.captchaToken,
      );
    }
  }, [captchaQuery.isSuccess, captchaQuery.data?.data?.captchaToken]);

  // ✅ Fetch captcha on mount
  useEffect(() => {
    captchaQuery.refetch();
  }, []);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Stack as={Form} spacing={5}>
          <Heading size="md">Login</Heading>

          <InputField
            name="username"
            label="Username"
            placeholder="Enter your username"
            autoComplete="off"
          />

          <Box position="relative">
            <PasswordField
              name="password"
              label="Password"
              placeholder="Enter your password"
            />
          </Box>

          <CaptchaImage query={captchaQuery} />

          <InputField
            name="captcha"
            label="Captcha"
            placeholder="Enter the text from the image"
          />

          <Button
            type="submit"
            colorScheme="brand"
            isLoading={authenticateQuery.isPending}
            loadingText="Signing in..."
            variant="brand"
            isDisabled={
              !formik.values.captchaToken || authenticateQuery.isPending
            }
            width="full"
          >
            Sign In
          </Button>

          <Divider />
        </Stack>
      )}
    </Formik>
  );
};

export default SignInForm;

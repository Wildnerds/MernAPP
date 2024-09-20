import { FC, useState } from "react";
import { View, StyleSheet } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";

import colors from "@utils/colors";
import { newUserSchema, signInSchema, yupValidator } from "@utils/validate";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import client from "app/api/client";
import { updateAuthState } from "app/store/stateAuth";
import useAuth from "app/hooks/useAuth";

import FormInput from "@ui/FormInput";
import WelcomeHeader from "@ui/WelcomeHeader";
import AppButton from "@ui/AppButton";
import FormDivider from "@ui/FormDivider";
import FormNavigator from "@ui/FormNavigator";
import CustomKeyAvoidView from "@ui/CustomKeyAvoidView";
import React from "react";

interface Props {}

const SignIn: FC<Props> = () => {
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const { signIn } = useAuth();

  const handleSubmit = async () => {
    const { values, error } = await yupValidator(signInSchema, userInfo);
    if (error) showMessage({ message: error, type: "danger" });

    if (values) signIn(values);
  };

  const handleChange = (userInput: string) => (text: string) => {
    setUserInfo({ ...userInfo, [userInput]: text });
  };

  const { email, password } = userInfo;

  return (
    <CustomKeyAvoidView>
      <View style={styles.innerContainer}>
        <WelcomeHeader />
        <View style={styles.formContainer}>
          <FormInput
            placeholder="Email"
            value={email}
            onChangeText={handleChange("email")}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={handleChange("password")}
          />
          <AppButton active title="Sign in" onPress={handleSubmit} />
          <FormDivider width={"50%"} height={2} backgroundColor={colors.primary} />
          <FormNavigator
            onLeftPress={() => navigate("ForgotPassword")}
            onRightPress={() => navigate("SignUp")}
            leftTitle="Forgot Password"
            rightTitle="Sign up"
          />
        </View>
      </View>
    </CustomKeyAvoidView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 15,
    flex: 1,
  },
  formContainer: {
    marginTop: 0,
  },
});

export default SignIn;

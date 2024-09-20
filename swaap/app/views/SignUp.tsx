import colors from "@utils/colors";
import FormInput from "@ui/FormInput";
import WelcomeHeader from "@ui/WelcomeHeader";
import { FC, useState } from "react";
import { View, StyleSheet, Button, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import AppButton from "@ui/AppButton";
import FormDivider from "@ui/FormDivider";
import FormNavigator from "@ui/FormNavigator";
import CustomKeyAvoidView from "@ui/CustomKeyAvoidView";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import * as yup from "yup";
import axios from "axios";
import { newUserSchema, yupValidator } from "@utils/validate";
import { runAxiosAsync } from "app/api/runAxiosAsync";
import { showMessage } from "react-native-flash-message";
import client from "app/api/client";
import useAuth from "app/hooks/useAuth";

interface Props {}

const SignUp: FC<Props> = (props) => {
  const [userInfo, setUserInfo] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();
  const { signIn } = useAuth();

  const handleChange = (userInput: string) => (text: string) => {
    setUserInfo({ ...userInfo, [userInput]: text });
  };

  const handleSubmit = async () => {
    const { values, error } = await yupValidator(newUserSchema, userInfo);
    if (error) {
      showMessage({ message: error, type: "danger" });
      return;
    }

    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(client.post("/auth/sign-up", values));

    if (res?.message) {
      showMessage({ message: res.message, type: "success" });
      signIn(values!);
    }

    setBusy(false);
  };

  const { email, name, password } = userInfo;

  return (
    <CustomKeyAvoidView>
      <View style={styles.innerContainer}>
        <WelcomeHeader />
        <View style={styles.formContainer}>
          <FormInput placeholder="Name" value={name} onChangeText={handleChange("name")} />
          <FormInput
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={handleChange("email")}
            autoCapitalize="none"
          />
          <FormInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={handleChange("password")}
          />
          <AppButton active={!busy} title="Sign up" onPress={handleSubmit} />
          <FormDivider width={"50%"} height={2} backgroundColor={colors.primary} />
          <FormNavigator
            onLeftPress={() => navigate("ForgotPassword")}
            onRightPress={() => navigate("SignIn")}
            leftTitle="Forgot Password"
            rightTitle="Sign in"
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

export default SignUp;

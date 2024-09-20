import colors from "@utils/colors";
import FormInput from "@ui/FormInput";
import WelcomeHeader from "@ui/WelcomeHeader";
import { FC, useState } from "react";
import { View, StyleSheet } from "react-native";
import AppButton from "@ui/AppButton";
import FormDivider from "@ui/FormDivider";
import FormNavigator from "@ui/FormNavigator";
import CustomKeyAvoidView from "@ui/CustomKeyAvoidView";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { AuthStackParamList } from "app/navigator/AuthNavigator";
import { myEmailRegex } from "@utils/validate";
import { showMessage } from "react-native-flash-message";
import client from "app/api/client";
import { runAxiosAsync } from "app/api/runAxiosAsync";

interface Props {}

const ForgotPassword: FC<Props> = (props) => {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();

  const handleSubmit = async () => {
    if (!myEmailRegex.test(email)) {
      showMessage({ message: "Invalid email address", type: "danger" });
      return;
    }

    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      client.post("/auth/forget-password", { email })
    );
    setBusy(false);

    if (res) {
      showMessage({ message: res.message, type: "success" });
    }
  };

  return (
    <CustomKeyAvoidView>
      <View style={styles.innerContainer}>
        <WelcomeHeader />
        <View style={styles.formContainer}>
          <FormInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <AppButton
            active={!busy}
            title={busy ? "Please wait!...." : "Request Link"}
            onPress={handleSubmit}
          />
          <FormDivider width={"50%"} height={2} backgroundColor={colors.primary} />
          <FormNavigator
            onLeftPress={() => navigate("SignUp")}
            onRightPress={() => navigate("SignIn")}
            leftTitle="Sign up"
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

export default ForgotPassword;

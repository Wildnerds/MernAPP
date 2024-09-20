import  {FC} from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface Props {}

const Home: FC<Props> = (props) => {
    return (
       <View>
        <Text>Home</Text>
       </View>
    )
};

const styles = StyleSheet.create({
    container: {
       
    },
}
    
)

export default Home;
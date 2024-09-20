import FormInput from '@ui/FormInput';
import { FC, useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import DatePicker from '@ui/DatePicker';
import React from 'react';
import OptionalModal from '@components/OptionModal';
import categories from '@utils/categories';
import colors from '@utils/colors';
import CategoryOption from '@ui/CategoryOption';
import AntDesign from '@expo/vector-icons/AntDesign';
import AppButton from '@ui/AppButton';
import CustomKeyAvoidView from '@ui/CustomKeyAvoidView';
import FormDivider from '@ui/FormDivider';
import * as ImagePicker from 'expo-image-picker';
import { showMessage } from 'react-native-flash-message';
import HorizontalImages from '@components/HorizontalImage';
import { newProductSchema, yupValidator } from '@utils/validate';
import mime from 'mime';
import useClient from 'app/hooks/useClient';
import { runAxiosAsync } from 'app/api/runAxiosAsync';

interface Props {}

const defaultInfo = {
  name: '',
  price: '',
  purchasingDate: new Date(),
  description: '',
  category: '',
};

const imageOptions = [{ value: 'Remove image', id: 'remove' }];

const NewListing: FC<Props> = () => {
  const [productInfo, setProductInfo] = useState({ ...defaultInfo });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState('');
  const { authClient } = useClient();

  const { category, description, price, name, purchasingDate } = productInfo;

  const handleChange = (name: string) => (text: string) => {
    setProductInfo({ ...productInfo, [name]: text });
  };

  const handleSubmit = async () => {
    const { error } = await yupValidator(newProductSchema, productInfo);
    if (error) {
      showMessage({ message: error, type: 'danger' });
      return;
    }

    const formData = new FormData();
    for (let key in productInfo) {
      const value = productInfo[key as keyof typeof productInfo];
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value);
      }
    }

    const newImages = images.map((img, index) => ({
      name: 'image_' + index,
      type: mime.getType(img),
      uri: img,
    }));

    newImages.forEach((img) => formData.append('images', img as any));

    const res = await runAxiosAsync(
      authClient.post('/product/postProduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer'+ authClient.defaults.headers.authorization,

        },
      })
    );
    console.log(res as any);
  };

  const handleImageSelection = async () => {
    try {
      const { assets } = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.4,
        allowsMultipleSelection: true,
      });
      if (!assets) return;

      const imageUris = assets.map(({ uri }) => uri);
      setImages([...images, ...imageUris]);
    } catch (error) {
      showMessage({ message: (error as any).message, type: 'danger' });
    }
  };

  return (
    <CustomKeyAvoidView>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Pressable style={styles.fileSelector} onPress={handleImageSelection}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="images" size={24} color="black" />
            </View>
            <Text style={styles.btnTitle}>Add Images</Text>
          </Pressable>
          <HorizontalImages
            images={images}
            onLongPress={(img) => {
              setSelectedImages(img);
              setShowImageOptions(true);
            }}
          />
        </View>

        <FormInput
          value={name}
          placeholder="Product Name"
          onChangeText={handleChange('name')}
        />
        <FormInput
          value={price}
          placeholder="Price"
          onChangeText={handleChange('price')}
          keyboardType="numeric"
        />
        <DatePicker
          title="Purchasing Date"
          value={purchasingDate}
          onChange={(purchasingDate) =>
            setProductInfo({ ...productInfo, purchasingDate })
          }
        />

        <Pressable
          style={styles.categorySelectButton}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={styles.categoryDropDown}>
            {category || 'Category'}
          </Text>
          <AntDesign name="caretdown" color={colors.black} />
        </Pressable>

        <OptionalModal
          visible={showCategoryModal}
          onRequestClose={() => setShowCategoryModal(false)}
          options={categories}
          renderItems={(item) => <CategoryOption {...item} />}
          onPress={(item) => {
            setProductInfo({ ...productInfo, category: item.name });
            setShowCategoryModal(false);
          }}
        />

        <FormInput
          value={description}
          placeholder="Description"
          multiline
          numberOfLines={4}
          onChangeText={handleChange('description')}
        />
        <AppButton title="Upload Product" onPress={handleSubmit} active={true} />
        <FormDivider width="50%" height={2} backgroundColor={colors.primary} />

        <OptionalModal
          visible={showImageOptions}
          onRequestClose={() => setShowImageOptions(false)}
          options={imageOptions}
          renderItems={(item) => (
            <Text style={styles.imageOption}>{item.value}</Text>
          )}
          onPress={(option) => {
            if (option.id === 'remove') {
              const newImages = images.filter((img) => img !== selectedImages);
              setImages([...newImages]);
            }
          }}
        />
      </View>
    </CustomKeyAvoidView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 7,
    paddingTop: 20,
  },
  fileSelector: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  btnTitle: {
    color: '#333',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    backgroundColor: '#ddd',
    borderRadius: 10,
    shadowColor: '#000',
    marginBottom: 10,
  },
  categorySelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: colors.primary,
    width: '100%',
    padding: 9,
    borderWidth: 1,
    borderColor: colors.inActive,
    borderRadius: 5,
    marginBottom: 10,
  },
  categoryDropDown: {},
  imageContainer: {
    flexDirection: 'row',
  },
  imageOption: {
    fontWeight: '600',
    fontSize: 20,
    color: colors.primary,
    padding: 10,
  },
});

export default NewListing;

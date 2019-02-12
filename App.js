import React from 'react'
import { Platform, View, Text, Image, Button } from 'react-native'
import ImagePicker from 'react-native-image-picker'

const createFormData = (photo) => {
  const data = new FormData();

  data.append("image", {
    name: photo.fileName,
    uri: photo.uri,
    type:photo.type
  });

  console.log(data);
  return data;
};

export default class App extends React.Component {
  state = {
    photo: null,
  }

  handleChoosePhoto = () => {
    const options = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ photo: response })
      }
    })
  }

  handleUploadPhoto = () => {
    fetch("https://visionapu.herokuapp.com/imgupload", {
      method: "POST",
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept':'*/*'
      },
      body: createFormData(this.state.photo)
    })
      .then(response => response.json())
      .then(response => {
        console.log("upload succes", response);
        alert("Upload success!");
        this.setState({ photo: null });
      })
      .catch(error => {
        console.log("upload error", error);
        alert("Upload failed!");
      });
  };

  render() {
    const { photo } = this.state
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {photo && (
          <React.Fragment>
            <Image
              source={{ uri: photo.uri }}
              style={{ width: 300, height: 300 }}
            />
            <Button title="Upload" onPress={this.handleUploadPhoto} />
          </React.Fragment>
        )}
        <Button title="Choose Photo" onPress={this.handleChoosePhoto} />
      </View>
    )
  }
}


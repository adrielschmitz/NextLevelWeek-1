import React, { useState } from 'react'
import { Image, Platform } from 'react-native'
import styled from 'styled-components/native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const Home = () => {
  const navigation = useNavigation()

  const [uf, setUf] = useState('')
  const [city, setCity] = useState('')

  const goToPoints = () => {
    navigation.navigate('Points')
  }

  return (
    <Container
      source={require('../../assets/home-background.png')}
      imageStyle={{ width: 274, height: 368 }}
    >
      <Main
        showsVerticalScrollIndicator={false}
      >
        <Content
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={300}
        >
          <Image source={require('../../assets/logo.png')}/>

          <TitleContainer>
            <Title>Seu marketplace de coleta de resíduos</Title>

            <Description>
              Ajudamos pessoas a encontrarem pontos de coleta de forma eviciente.
            </Description>
          </TitleContainer>

          <InputContainer>
            <Input
              placeholder="Selecione o estado"
              value={uf}
              maxLength={2}
              autoCapitalize="characters"
              autoCorrect={false}
              onChangeText={setUf}
            />

            <Input
              placeholder="Selecione a cidade"
              autoCorrect={false}
              value={city}
              onChangeText={setCity}
            />
          </InputContainer>
        </Content>
      </Main>

      <Footer>
        <RectButtonComponent onPress={goToPoints}>
          <ButtonIcon>
            <Feather name="arrow-right" size={24} color="white"/>
          </ButtonIcon>

          <ButtonText>
            Entrar
          </ButtonText>
        </RectButtonComponent>
      </Footer>
    </Container>
  )
}

export default Home

const Container = styled.ImageBackground`
  flex: 1; 
  padding: 32px;
`

const Content = styled.KeyboardAvoidingView`
  flex: 1;
  justify-content: center;
`

const Main = styled.ScrollView`
  flex: 1;
`

const TitleContainer = styled.View``

const Title = styled.Text`
  color: #322153;
  font-size: 32px;
  font-family: Ubuntu_700Bold;
  max-width: 260px;
  margin-top: 64px;
`

const Description = styled.Text`
  color: #6C6C80;
  font-size: 16px;
  margin-top: 16px;
  font-family: Roboto_400Regular;
  max-width: 260px;
  line-height: 24px;
`

const Input = styled.TextInput`
  background-color: white;
  height: 60px;
  margin-bottom: 10px;
  border-radius: 10px;
  font-size: 16px;
  padding: 0 24px;
`

const RectButtonComponent = styled(RectButton)`
  background-color: #34CB79;
  height: 60px;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 8px;
`

const Footer = styled.View``

const ButtonIcon = styled.View`
  height: 60px;
  width: 60px;
  background-color: rgba(0, 0, 0, 0.1);
  justify-content: center;
  align-items: center;
`

const ButtonText = styled.Text`
  flex: 1;
  justify-content: center;
  text-align: center;
  font-size: 16px;
  color: white;
  font-family: Roboto_500Medium;
`

const InputContainer = styled.View`
  margin-top: 10px;
  padding-bottom: 40px;
`
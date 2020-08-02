import React, { useEffect, useState } from 'react'
import { TouchableOpacity, Linking } from 'react-native'
import Constants from 'expo-constants'
import styled from 'styled-components/native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { RectButton } from 'react-native-gesture-handler'
import Api from '../../services/api'
import * as MailComposer from 'expo-mail-composer'

type ParamsType = {
  point_id: number,
}

type DetailType = {
  point: {
    image: string,
    name: string,
    email: string,
    whatsapp: string,
    city: string,
    uf: string,
  },
  items: { title: string }[]
}

const Detail = () => {
  const navigation = useNavigation()
  const [details, setDetails] = useState<DetailType>({} as DetailType)
  const route = useRoute()

  const params = route.params as ParamsType

  const getDetails = async () => {
    const response = await Api.get(`points/${params.point_id}`)

    setDetails(response.data)
  }

  useEffect(() => {
    getDetails()
  })

  const handleBack = () => {
    navigation.goBack()
  }

  const handleGoToWhatsapp = () => {
    Linking.openURL(`whatsapp://send?phone=${details.point.whatsapp}&text=Tenho interesse sobre coleta de resíduos`)
  }

  const handleComposeMail = () => {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [details.point.email],
    })
  }

  if (!details.items) {
    return null
  }

  return (
    <Container>
      <Content>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-left" size={22} color="#34CB79"/>
        </TouchableOpacity>

        <PointImage source={{ uri: details.point.name }}/>

        <PointName>{details.point.name}</PointName>

        <PointItems>{details.items.map(item => item.title).join(', ')} </PointItems>

        <Address>
          <AddressTitle>Endereço</AddressTitle>
          <AddressContent>{details.point.city}, {details.point.uf}</AddressContent>
        </Address>
      </Content>

      <Footer>
        <Button onPress={handleGoToWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="white"/><ButtonText>WhatsApp</ButtonText>
        </Button>

        <Button onPress={handleComposeMail}>
          <Icon name="mail" size={20} color="white"/><ButtonText>E-mail</ButtonText>
        </Button>
      </Footer>
    </Container>
  )
}

export default Detail

const Container = styled.SafeAreaView`
  flex: 1;
`

const Content = styled.View`
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: ${20 + Constants.statusBarHeight}px;
`

const PointImage = styled.Image`
   margin-top: 24px;
   width: 100%;
   height: 200px;
   border-top-left-radius: 8px;
   border-top-right-radius: 8px;
`

const PointName = styled.Text`
  color: #322153;
  margin-top: 24px;
  font-family: Ubuntu_700Bold;
  font-size: 28px;
`

const PointItems = styled.Text`
   color: #34CB79;
   font-size: 16px;
   font-family: Roboto_400Regular;
   margin-top: 8px;
   line-height: 24px;
`

const AddressTitle = styled.Text`
  color: #322153;
  font-family: Roboto_500Medium;
  font-size: 16px;
`

const AddressContent = styled.Text`
  font-family: Roboto_400Regular;
  line-height: 24px;
  margin-top: 8px;
  color: #6C6C80;
`

const Address = styled.View`
  flex: 1;
  margin-top: 28px;
`

const Footer = styled.View`
  border-top-width: 2px;
  border-color: #999;
  padding: 20px 32px;
  flex-direction: row;
  justify-content: space-between;
`

const Button = styled(RectButton)`
  width: 48%;
  background-color: #34CB79;
  border-radius: 10px;
  height: 50px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const ButtonText = styled.Text`
  margin-left: 8px;
  color: white;
  font-size: 16px;
  font-family: Roboto_500Medium;
`

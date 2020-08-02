import React, { useEffect, useState } from 'react'
import { TouchableOpacity, ScrollView, Alert } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import Constants from 'expo-constants'
import styled from 'styled-components/native'
import { useNavigation } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import Api from '../../services/api'
import * as Location from 'expo-location'
import { useRoute } from '@react-navigation/native'

type ItemType = {
  id: string,
  title: string,
  image_url: string
}

type PointType = {
  id: number,
  image: string,
  name: string,
  latitude: number,
  longitude: number,
}

type InitialPositionType = {
  latitude: number,
  longitude: number,
}

type ParamsType = {
  uf: string,
  city: string
}

const Points = () => {
  const [items, setItems] = useState<ItemType[]>([])
  const [points, setPoints] = useState<PointType[]>([])
  const [items_selected, setItemsSelected] = useState<string[]>([])
  const [initial_position, setInitialPosition] = useState<InitialPositionType>({
    latitude: 0,
    longitude: 0,
  })

  const route = useRoute()
  const route_params = route.params as ParamsType

  const navigation = useNavigation()

  useEffect(() => {
    Api.get('/items')
      .then((response) => {
        setItems(response.data)
      })
  }, [])

  const loadPosition = async () => {
    const { status } = await Location.requestPermissionsAsync()

    if (status !== 'granted') {
      Alert.alert('Ops', 'Precisamos da sua permisão para ter acesso a sua localização.')
      return
    }

    const location = await Location.getCurrentPositionAsync()

    const { latitude, longitude } = location.coords

    setInitialPosition({ latitude, longitude })
  }

  useEffect(() => {
    loadPosition()
  }, [])

  const getPoints = async () => {
    const response = await Api.get('points', {
      params: {
        city: route_params.city,
        uf: route_params.uf,
        items: items_selected,
      },
    })

    setPoints(response.data)
  }

  useEffect(() => {
    getPoints()
  }, [items_selected])

  const handleBack = () => {
    navigation.goBack()
  }

  const handleNavigateToDetail = (id: number) => {
    navigation.navigate('Detail', {
      point_id: id,
    })
  }

  const handleItemSelect = (id: string) => {
    if (items_selected.includes(id)) {
      const items_filtered = items_selected.filter((item) => item !== id)
      setItemsSelected(items_filtered)
      return
    }

    setItemsSelected([...items_selected, id])
  }

  return (
    <>
      <Container>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-left" size={22} color="#34CB79"/>
        </TouchableOpacity>

        <Title>Bem Vindo.</Title>
        <Description>Encontre no mapa um ponto de coleta.</Description>

        <MapContainer>
          {initial_position.latitude !== 0 && (
            <Map
              initialRegion={{
                latitude: initial_position.latitude,
                longitude: initial_position.longitude,
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}

            >
              {points.map((point) => (
                <MapMarker
                  key={String(point.id)}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                  onPress={() => handleNavigateToDetail(point.id)}
                >
                  <MapMarkerContainer>
                    <MapMarkerImage source={{ uri: point.image }}/>
                    <MapMarkerTitle>{point.name}</MapMarkerTitle>
                  </MapMarkerContainer>
                </MapMarker>
              ))}
            </Map>
          )}
        </MapContainer>
      </Container>

      <ItemsContainer>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          {items.map((item) => (
            <Item
              key={String(item.id)}
              activeOpacity={0.6}
              onPress={() => handleItemSelect(String(item.id))}
              color={items_selected.includes(String(item.id)) ? '#34CB79' : '#eee'}
            >
              {/*<ItemSvgImage uri={'https://image.flaticon.com/icons/svg/1179/1179318.svg'}/>*/}
              <ItemTitle>{item.title}</ItemTitle>
            </Item>
          ))}
        </ScrollView>
      </ItemsContainer>
    </>
  )
}

export default Points

const Container = styled.View`
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: ${20 + Constants.statusBarHeight}px;
`

const Title = styled.Text`
  font-size: 20px;
  font-family: Ubuntu_700Bold;
  margin-top: 24px;
`

const Description = styled.Text`
  color: #6c6c80;
  font-size: 16px;
  margin-top: 4px;
  font-family: Roboto_400Regular;
`

const MapContainer = styled.View`
  flex: 1;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 16px;
`

const Map = styled(MapView)`
  width: 100%;
  height: 100%;
`

const MapMarker = styled(Marker)`
  width: 90px;
  height: 80px;
`

const MapMarkerContainer = styled.View`
  width: 90px;
  height: 90px;
  background-color: #34CB79;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  align-items: center;
`

const MapMarkerImage = styled.Image`
  width: 90px;
  height: 45px;
`

const MapMarkerTitle = styled.Text`
  flex: 1;
  font-family: Roboto_400Regular;
  color: white;
  font-size: 13px;
  line-height: 23px;
`

const ItemsContainer = styled.View`
  flex-direction: row;
  margin-top: 16px;
  margin-bottom: 32px;
`

type ItemProps = {
  color: '#eee' | '#34CB79',
}

const Item = styled.TouchableOpacity<ItemProps>`
  background-color: white;
  border-width: 2px;
  border-color: ${(p) => p.color};
  height: 120px;
  width: 120px;
  border-radius: 8px;
  padding: 20px 16px 16px 16px;
  margin-right: 8px;
  align-items: center;
  justify-content: space-between;
  text-align: center;
`

const ItemSvgImage = styled(SvgUri)`
  width: 45px;
  height: 45px;
`

const ItemTitle = styled.Text`
  font-family: Roboto_400Regular;
  text-align: center;
  font-size: 13px;
`

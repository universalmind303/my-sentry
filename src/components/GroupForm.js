import React, {Component} from 'react';
import { Text, View} from 'react-native';
import { connect } from 'react-redux';
import {Actions} from 'react-native-router-flux';
import Header from './Header';
import { Container, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, H1, List, ListItem, InputGroup, Picker, Label, Item, Input, Form, style} from 'native-base';
import {postGroup, getGroups } from '../actions/axiosController';

const mapStateToProps = ({groups, auth, searchBar}) => {
  return {
    adminUser: auth,
    groupName: groups.groupName,
    members: groups.members,
    searchResults: searchBar.results,
    searchValue: searchBar.searchValue
  };
};

export default connect(mapStateToProps)(function GroupForm ({adminUser, members, groupName, searchResults, searchValue, tempList, dispatch}) {
  return (
    <Container>

      <Header />

      <Content>

        <Form>
          <Item>
            <Input onChangeText={(text) => dispatch({type: 'ADD_NAME', text: text})} placeholder='Group Name' />
          </Item>
        </Form>

        <Item>
          <List dataArray={members}
            renderRow={member =>
              <ListItem>
                <Text>{member.username}</Text>
              </ListItem>
            }>
          </List>
        </Item>

        <Item>
          <Input onChangeText={text => dispatch({type: 'SEARCH_NAME', text: text, users: members})} value={searchValue} placeholder='Add a Member'/>
          <List dataArray={searchResults}
            renderRow={user =>
              <ListItem onPress={() => {
                dispatch({type: 'ADD_MEMBER', form: true, user: user});
                dispatch({type: 'CLEAR_SEARCH_VALUE'});
              }}>
                <Text>{user.username}</Text>
              </ListItem>
            }>
          </List>
        </Item>

      </Content>

      <Button
        style={{ alignSelf: 'center', marginTop: 20, marginBottom: 20 }}
        onPress={() => {
          let data = {
            name: groupName,
            members: [...members, adminUser ]
          };
          postGroup(data).then(() => getGroups(dispatch).then(() => Actions.groups()));
        }}>
        <Text>Create Group</Text>
      </Button>

    </Container>
  );
});

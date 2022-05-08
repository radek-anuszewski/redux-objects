import {useRef, memo} from "react";
import {connect, shallowEqual, useDispatch, useSelector} from "react-redux";

export const UPDATE_USER = 'UPDATE_USER';
export const USER_FETCHED = 'USER_FETCHED';

function App() {
  return (
    <>
      <UserForm />
      <div>
        <h2>Containers:</h2>
        <UserDisplayContainerSelector />
        <UserDisplayMemoContainerSelector />
        <UserDisplayContainerConnect />
        <UserDisplayMemoContainerConnect />
        <UserDisplayContainerSelectorShallowEqual />
        <UserDisplayOnlyContainerConnect />
        <UserDisplayPlainContainerSelector />
        <UserDisplayPlainContainerConnect />
      </div>
    </>
  );
}

const UserForm = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const onChange = e => dispatch({
    type: UPDATE_USER,
    payload: { field: e.target.id, value: e.target.value }
  });

  const userFetched = payload => dispatch({
      type: USER_FETCHED,
      payload,
  })

  return (
    <>
      <form>
        <label htmlFor="name">Name</label><input id="name" type="text" value={user.name} onChange={onChange} /><br />
        <label htmlFor="surname">Surname</label><input id="surname" type="text" value={user.surname} onChange={onChange} /><br />
        <label htmlFor="age">Age</label><input id="age" type="number" value={user.age} onChange={onChange} /><br />
      </form>
      <button onClick={() => userFetched(user)}>
        FAKE API - simulating new object but with the same values, for example from fetch request
      </button>
    </>
  )
}

const UserDisplay = props => {
  const rerenderCount = useRef(0);

  return (
    <div>
      Name: {props.user.name}<br />
      Surname: {props.user.surname} <br />
      Rerender count: {rerenderCount.current++}, notice no age direct usage
    </div>
  );
};

const UserDisplayContainerSelector = () => {
  const user = useSelector(state => state.user);

  return (
    <>
      <h3 className="bad">Container with regular useSelector</h3>
      <UserDisplay user={user} />
    </>
  )
};

const UserDisplayContainerSelectorShallowEqual = () => {
  const user = useSelector(state => state.user, shallowEqual);

  return (
    <>
      <h3 className="warn">Container with regular useSelector and shallowEqual</h3>
      <UserDisplay user={user} />
    </>
  )
};

const UserDisplayMemo = memo(UserDisplay);

const UserDisplayMemoContainerSelector = () => {
  const user = useSelector(state => state.user);

  return (
    <>
      <h3 className="bad">Container with regular useSelector and memo</h3>
      <UserDisplayMemo user={user} />
    </>
  )
};

const UserDisplayContainerConnect = (() => {
  const Container = props => (
    <>
      <h3 className="bad">Container with connect</h3>
      <UserDisplay user={props.user} />
    </>
  );

  const mapStateToProps = state => ({
    user: state.user,
  });

  return connect(mapStateToProps)(Container);
})();

const UserDisplayMemoContainerConnect = (() => {
  const Container = props => (
    <>
      <h3 className="bad">Container with connect and memo</h3>
      <UserDisplayMemo user={props.user} />
    </>
  );

  const mapStateToProps = state => ({
    user: state.user,
  });

  return connect(mapStateToProps)(Container);
})();

const UserDisplayPlain = props => {
  const rerenderCount = useRef(0);

  return (
    <div>
      Name: {props.name}<br />
      Surname: {props.name} <br />
      Rerender count: {rerenderCount.current++}, notice no rerenders when age changed!
    </div>
  );
}

const UserDisplayPlainContainerSelector = () => {
  const name = useSelector(state => state.user.name);
  const surname = useSelector(state => state.user.surname);

  return (
    <>
      <h3 className="good">Container with regular useSelector BUT with plain values read from store instead of object</h3>
      <UserDisplayPlain name={name} surname={surname} />
    </>
  )
};

const UserDisplayPlainContainerConnect = (() => {
  const Container = props => (
    <>
      <h3 className="good">Container with connect BUT with plain values</h3>
      <UserDisplayPlain {...props} />
    </>
  );

  const mapStateToProps = state => ({
    name: state.user.name,
    surname: state.user.surname,
  });

  return connect(mapStateToProps)(Container);
})();

const UserDisplayOnlyContainerConnect = (() => {
  const Container = props => (
    <>
      <h3 className="warn">Container with connect BUT only user returned</h3>
      <UserDisplayPlain {...props} />
    </>
  );

  const mapStateToProps = state => state.user;

  return connect(mapStateToProps)(Container);
})();

export default App;

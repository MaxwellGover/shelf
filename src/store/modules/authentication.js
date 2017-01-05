import firebase from 'firebase'

const authentication = {
    state: {
        isAuthed: false,
        authId: '',
        isRetailer: false
    },
    mutations: {
        authUser (state, user) {
            state.isAuthed = true;
            state.authId = user.uid;
        },
        notAuthed (state) {
            state.isAuthed = false;
            state.authId = '';
            state.isRetailer = false
        },
        isRetailer (state) {
            state.isRetailer = true
        },
        isNotRetailer (state) {
            state.isRetailer = false
        }
    },
    actions: {
        checkUser (context, user) {
    
            if (!user.uid) {

                // Do nothing.

            } else if (firebase.database().ref('/users/' + user.uid).once('value').then((snapshot) => snapshot.val().isRetailer)) {

                context.commit('authUser', user);
                
                context.commit('isRetailer');

            } else {
                
                context.commit('authUser', user);
                
                context.commit('isNotRetailer');
            };
        },
        signOut (context) {
            context.commit('notAuthed')
        },
        setRetailer (context, payload) {
            
            // Set retailer info in Firebase.
            
            var uid = payload.user.uid;
            firebase.database().ref('/users/' + uid).set({
                name: payload.name,
                email: payload.email,
                location: payload.retailerLocation,
                isRetailer: payload.isRetailer
            });  
        
        },
        setNewUser (context, payload) {
            
            // Sets a user in firebase w/ a isRetailer value of false. 
            
            var uid = payload.user.uid;
            
            firebase.database().ref('/users/' + uid).set({
                name: payload.name,
                email: payload.email,
                isRetailer: payload.isRetailer
            });
        }
    },
    getters: {}
};

export default authentication;
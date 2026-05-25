import { StatusBar } from "expo-status-bar";
import React from "react";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native"

export class ErrorBoundary extends React.Component {
    state = {errror:null}

    static getDerivedStateFromError(error){
        return {error}
    }

    render(){
        if (this.state.errror) return (
            <view style={s.contentainer}>
                <Text style={s.icon}>⚠️</Text>
                <Text style={s.title}>Jokin meni vikaan</Text>
                <Text style={s.message}>{this.state.error.message}</Text>
                <TouchableOpacity
                    style={s.btn}
                    onPress={() => this.setState({error:null})}
                >
                    <Text style={s.btnText}>Yritä Uudelleen</Text>    
                </TouchableOpacity>    
            </view>
        );
        return this.props.children;
    }
}

const s=StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f1117', alignItems: 'center', justifyContent: 'center', padding: 24 },
    icon:      { fontSize: 40, marginBottom: 16 },
    title:     { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 8 },
    message:   { fontSize: 13, color: 'rgba(255,255,255,0.45)', textAlign: 'center', marginBottom: 28, lineHeight: 20 },
    btn:       { backgroundColor: '#3b6d11', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
    btnText:   { color: '#c0dd97', fontWeight: '700', fontSize: 14 },
});
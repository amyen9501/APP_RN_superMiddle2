import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import useTaskStore from "../../../store/useTaskStore";

export default function Class() {
    const { categories, addCategory } = useTaskStore(); //這裡是把taskstore的資料拿過來
    const [newCate, setNewCate] = useState(''); //新增新的分類所需
    const [isAdding, setIsAdding] = useState(false); //能反應要輸入新分類的變化
    const saveAdd = () => {
        if (newCate.trim()) {
            addCategory(newCate.trim());
            setNewCate('');
            setIsAdding(false);
        }
    }

    return (
        <View style={styles.container}>
             <View style={styles.missionBox}>
        <LinearGradient
          colors={['#FFD1DC', '#D1C4E9', '#a28fff']}
          style={styles.missionBox}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        >
            <Text style={styles.missionText}>我的任務</Text>{/*<Text style={styles.missionclasscount}>共個分類</Text>*/}</LinearGradient></View>

            {/*這裡是按鈕，當按下新增會變成輸入分類的地方*/}
            <View>
                {!isAdding ?
                    (
                        <View>
                        {/*只是個按鈕*/}
                            <TouchableOpacity style={styles.button} onPress={()=>setIsAdding(true)}>
                                <Text style={styles.addclass}>新增分類</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.addclasswin}>
                            {/*變成輸入處*/}
                           
                            <TextInput
                             style={styles.addclass}
                                placeholder="請輸入分類名稱..."
                                value={newCate}
                                onChangeText={setNewCate}
                                
                            />
<View style={styles.twobutton}>
                            <LinearGradient
          colors={['#FFD1DC', '#D1C4E9', '#a28fff']}
         style={styles.submitbutton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }} ><TouchableOpacity  onPress={saveAdd}>
                                
        <Text  style={styles.submit}>送出</Text> 
                            </TouchableOpacity></LinearGradient>

                            <TouchableOpacity  style={styles.cancelbutton} onPress={() => setIsAdding(false)}>
                                <Text  style={styles.cancel}>取消</Text>
                            </TouchableOpacity>
                            </View>
</View>
                        
                    )
                }
            </View>


            {/*這裡是能列出現在有的分類的表單*/}
            <FlatList
                data={categories}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <View style={styles.classcard}>
                        {/*這裡是顯示區 可以用style調*/}
                        <View style={styles.classcard}>
<Text style={styles.block}></Text>
<View >
                    <Text style={styles.classview}>{item}</Text>
                    <Text style={styles.classtext}>任務</Text>
                    </View></View></View>
                )}
            />
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff5f7",
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#ffffff",
    
    borderRadius: 10,
    marginBottom: 70,
     elevation: 4,
    
    },
    cancelbutton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#ffffff",
    
    borderRadius: 10,
    marginBottom: 20,
     elevation: 4,
    marginLeft:"40",
    paddingHorizontal: 20,
    },
     submitbutton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#9393DD",
    borderRadius: 10,
    marginBottom: 20,
     elevation: 4,
    marginRight:"40",
    paddingHorizontal: 20,
    },
    twobutton: {
        flexDirection: 'row',
        alignItems: 'flex-start',
     width: '100%',
    },

 missionBox: {
    backgroundColor: "#ffffff00",
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
    missionText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
    missionclasscount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: -10,
    marginBottom: 20,
  },
  addclass: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9393DD",
    textAlign: "center",
     marginTop: 20,
    marginBottom: 20,
    
    width: '100%',
  },
   addclasswin: {
        alignItems: 'center',
        backgroundColor: "#ffffff",
    width: '100%',
    borderRadius: 10,
    marginBottom: 50,
     elevation: 4,
    paddingHorizontal: 20,
  },
     submit: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
   
   
    margin: 10,
  },
     cancel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#9393DD",
    textAlign: "center",
 
    margin: 10,
  },
  classcard: {
    backgroundColor: "#fff",
    borderColor: '#ababab00',
    borderWidth: 1.5,
    marginVertical: 5,
    flexDirection: 'row',
    width: '100%',
    borderRadius: 10,
  },

  block :{
  alignItems: 'center',
   borderRadius: 10,

    backgroundColor:"#f3acc1",
    margin: 5,
     marginRight: 20,
      textAlign: "center",
      fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    padding:10,
    
  },
  classview: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#312d2d",
 
    
      overflow: 'hidden',
  },
  classtext:{


fontSize: 12,
    fontWeight: "bold",
    color: "#f3acc1",
 
    
      overflow: 'hidden',



  }
})




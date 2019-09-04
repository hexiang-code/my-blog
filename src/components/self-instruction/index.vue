<template>
    <div class="instruction-content">
        <div class="instruction-left" v-html="text">
            
        </div>
        <div class="instruction-right">
            <table border="1">
                <tr>
                    <th>姓名</th>
                    <td>何翔</td>
                    <th>年龄</th>
                    <td>18</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import tableData from '../../config/selfInstruction'
export default {
    data() {
        return {
            text: '123123<br/>adfasf',
            tableData: tableData,
            text1: ''
        }
    },
  
    mounted() {

    },

    methods: {

    }
}
</script>

<style lang="scss" scoped>
    .instruction-content {
        width: 80%;
        display: flex;
        margin: 0 auto;
        justify-content: space-around;

        .instruction-left {
            width: 40%;
            height: 500px;
            border: 1px solid #5f5f5f;
        }

        .instruction-right {
            width: 40%;
            line-height: 100px;
            color: #000;
            border: 1px solid #5f5f5f;
        }
    }
</style>
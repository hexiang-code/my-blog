<template>
    <div class="login-window" :class="{ 'login-widow_open': isShowWindow, 'login-window_closed': !isShowWindow}">
        <!-- <div class="login-input">
            <p class="login-label">ACCOUNT:</p>
            <input type="text" placeholder="请输入账号" />
        </div>
        <div class="login-input">
            <p class="login-label">PASSWORD:</p>
            <input type="password" placeholder="请输入密码" />
        </div>
        <div class="login-btn">
            <button @click="login">confirm</button>
            <button @click="isShowWindow = false">cancel</button>
        </div> -->
        <slot name="window-content"></slot>
    </div>
</template>
<script>
export default {
    name: 'window-utils',
    props: {
        isShowLogin: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        
    }
}
</script>
<style scoped lang="scss">
    .login-window {
        visibility: hidden;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 30%;
        height: 30%;
        margin: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid black;
        border-radius: 10px;
        backdrop-filter: blur(10px) brightness(110%);
        z-index: 1;
        transform: translateY(-100%);

        .login-input {
            display: flex;
            height: 60px;
            align-items: center;
        }
        .login-label {
            position: relative;
            display: inline-block;
            width: 100px;
            margin-right: 40px;
            text-align: right;
            font-weight: 700;
            color: #1296db;
        }

        .login-label::before {
            content: '';
            position: absolute;
            width: 30px;
            height: 30px;
            right: -30px;
            top: -5px;
            background-image: url('../../assets/status-icon/leimu-icon.png');
            background-size: 30px 30px;
        }

    
        input {
            height: 30px;
            padding-left: 20px;
            border: 1px solid #1296db;
            color: #1296db;
            background-color: transparent;
        }

        .login-btn {
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .login-btn button {
            position: relative;
            padding: 0;
            margin: 0;
            width: 100px;
            height: 40px;
            background-color: none;
            text-transform: uppercase;
            border: 4px solid #1296db;
            background-color: transparent;
            color: #ffffff;
            cursor: pointer;
        }
        
        .login-btn button:nth-child(1) {
            margin-right: 60px;
            color: #1296db;
        }

        .login-btn button::after, .login-btn button::before {
            content: '';
            position: absolute;
            width: 10px;
            height: 4px;
            background-color: #fff;
        }

        .login-btn button::after {
            top: 32px;
            right: 10px;
        }

        .login-btn button::before {
            top: -4px;
        }
        
        .login-btn button:hover::before {
            animation: translateBefore 1s forwards;
        }

        .login-btn button:hover::after {
            animation: translateAfter 1s forwards;
        }

        @keyframes translateBefore {
            0% {
                left: 0px;
            }

            100% {
                left: 80px;
                background-color: #1296db;
            }
        }

        @keyframes translateAfter {
            0% {
                right: 10px;
            }

            100% {
                right: 80px;
                background-color: #1296db;
            }
        }

        ::-webkit-input-placeholder { /* Chrome/Opera/Safari */ 
			color: #1296db;
		}
		::-moz-placeholder { /* Firefox 19+ */  
			color: #1296db;
		}
		:-ms-input-placeholder { /* IE 10+ */ 
            color: #1296db;
		}

		:-moz-placeholder { /* Firefox 18- */ 
		    color: #1296db;
		}
    }

    .login-widow_open {
        visibility: visible;
        animation: open-animation 1s ease-out forwards;

        @keyframes open-animation {
            0% {
                opacity: 0;
                transform: translateY(-100%)
            }

            30% {
                opacity: 0.5;
                transform: translateY(-60%)
            }

            50% {
                opacity: 1;
                transform: translateY(0)  
            }

            70% {
                opacity: 1;
                transform: translateY(-15%)  
            }
            
            100% {
                opacity: 1;
                transform: translateY(0)
            }
        }
    }

    .login-window_closed {
        visibility: visible;
        animation: close-animation 0.5s ease-in forwards; 
        
        @keyframes close-animation {
            0% {
                transform: translateY(0);
                opacity: 1;
            }

            100% {
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
            }
        }
    }
</style>
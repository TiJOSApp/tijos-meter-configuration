'use strict';

var offWidth = window.screen.width / 10;
document.getElementsByTagName("html")[0].style.fontSize = offWidth + 'px';

var open = false;
var isSetting = false;

var app = {
    initialize: function initialize() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function onDeviceReady() {
        $('.init-button').click(function () {
            try {
                serial.close();
            } catch (e) {}
            app.initPort();
        });

        $('#setBase').click(function () {
            if (!open) {
                mui.toast('请先进行初始化', { duration: 1500, type: 'div' });
                return;
            }
            var val = $('#base').val();
            if (!val.match(/^[123456789][123457890]*$/)) {
                mui.toast('请填写正确的水表底数', { duration: 1500, type: 'div' });
                return;
            }
            var hex = Number(val).toString(16).padStart(8, '0');
            hex = hexArarryAddSpace(hex).split(' ').reverse().join('');
            var str = 'AABB01' + hex;
            str = str + getCheckBit(hexArarryAddSpace(str).split(' '));
            app.sendMessage(str);
        });
        $('#setSN').click(function () {
            if (!open) {
                mui.toast('请先进行初始化', { duration: 1500, type: 'div' });
                return;
            }
            var val = $('#SNBefore').val();
            var val1 = $('#SNAfter').val();
            if (!val.match(/^[1234567890]{4}$/) || !val1.match(/^[1234567890]{10}$/)) {
                mui.toast('请填写正确的水表编号', { duration: 1500, type: 'div' });
                return;
            }
            var str = 'AABB02' + val + val1;
            str = str + getCheckBit(hexArarryAddSpace(str).split(' '));
            app.sendMessage(str);
        });
        $('#setIP').click(function () {
            if (!open) {
                mui.toast('请先进行初始化', { duration: 1500, type: 'div' });
                return;
            }
            var val = $('#ip1').val();
            var val1 = $('#ip2').val();
            var val2 = $('#ip3').val();
            var val3 = $('#ip4').val();
            var val4 = $('#port').val();
            if (!val.match(/^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])$/) || !val1.match(/^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])$/) || !val2.match(/^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])$/) || !val3.match(/^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])$/) || !val4.match(/^[123456789][123457890]*$/)) {
                mui.toast('请填写正确的IP、端口', { duration: 1500, type: 'div' });
                return;
            }
            var str = 'AABB04' + Number(val).toString(16) + Number(val1).toString(16) + Number(val2).toString(16) + Number(val3).toString(16) + Number(val4).toString(16);
            str = str + getCheckBit(hexArarryAddSpace(str).split(' '));
            app.sendMessage(str);
        });
        $('#report').click(function () {
            // NB唤醒
            if (!open) {
                mui.toast('请先进行初始化', { duration: 1500, type: 'div' });
                return;
            }
            app.sendMessage('AABB0469');
        });
    },
    initPort: function initPort() {
        var errorCallback = function errorCallback(message) {
            mui.toast(message, { duration: 1500, type: 'div' });
        };
        serial.requestPermission(function (successMessage) {
            // open serial port
            serial.open({
                baudRate: 9600,
                dtr: true,
                rts: true
            },
            // if port is succesfuly opened
            function (successMessage) {

                // register the read callback
                serial.registerReadCallback(function success(data) {
                    // decode the received message
                    var view = new Uint8Array(data);
                    if (open = true) {
                        //mui.toast(String.fromCharCode.apply(null, new Uint8Array(view)).trim(),{ duration:1500, type:'div' });
                        $('button').removeAttr('disabled');
                        mui.toast('设置成功', { duration: 1500, type: 'div' });
                        isSetting = false;
                    } else {
                        open = false;
                        isSetting = true;
                        mui.toast('初始化完成', { duration: 1500, type: 'div' });
                    }
                },
                // error attaching the callback
                errorCallback);
            },
            // error opening the port
            errorCallback);
        },
        // user does not grant permission
        errorCallback);
    },
    sendMessage: function sendMessage(str) {
        str = str.toLocaleLowerCase();
        $('button').attr('disabled', 'disabled');
        serial.writeHex(''.padEnd(160, '00'), function () {
            isSetting = true;
            setTimeout(function () {
                serial.writeHex(str, function () {
                    setTimeout(function () {
                        if (isSetting) {
                            mui.toast('设置超时，请重试', { duration: 1500, type: 'div' });
                            $('button').removeAttr('disabled');
                            isSetting = false;
                        }
                    }, 1500);
                }, function (error) {
                    mui.toast(error, { duration: 1500, type: 'div' });
                    $('button').removeAttr('disabled');
                    isSetting = false;
                });
            }, 300);
        }, function (error) {
            mui.toast(error, { duration: 1500, type: 'div' });
            $('button').removeAttr('disabled');
            isSetting = false;
        });
    }
};

app.initialize();

function hexArarryAddSpace(str) {
    var result = '';
    for (var i = 0; i < str.length; i += 2) {
        if (result !== '') result += ' ';
        result += str[i] + str[i + 1];
    }
    return result;
}

function getCheckBit(arr) {
    var str = 0;
    arr.forEach(function (item) {
        str += Number('0x' + item);
    });
    return str.toString(16).slice(-2).toLocaleUpperCase();
}
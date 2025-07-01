import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
import { useAuth } from '@/context/AuthContext';

interface RazorpayPaymentProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onError: (error: any) => void;
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({ amount, onSuccess, onError }) => {
  const { user } = useAuth();
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handlePayment = () => {
    setShowRazorpay(true);
  };

  const generateOrderHtml = () => {
    const options = {
      key: 'rzp_test_eVMmsDezBs0Yo5',
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      name: 'NoQpay',
      description: 'Payment for Order',
      image: 'https://noqpay.com/logo.png',
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || ''
      },
      theme: {
        color: '#0070BA',
        backdrop_color: '#ffffff',
        hide_topbar: true
      },
      retry: {
        enabled: true,
        max_count: 3
      },
      send_sms_hash: true,
      remember_customer: true
    };

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <title>NoQpay Payment</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f8f9fa;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .loading {
              text-align: center;
              color: #0070BA;
            }
          </style>
        </head>
        <body>
          <div id="payment-container">
            <div class="loading">Initializing payment...</div>
          </div>
          <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
          <script>
            function initPayment() {
              const options = ${JSON.stringify(options)};
              
              options.handler = function(response) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'success',
                  data: response
                }));
              };

              options.modal = {
                ondismiss: function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'dismiss'
                  }));
                },
                animation: true,
                confirm_close: true
              };

              try {
                const rzp = new Razorpay(options);
                rzp.on('payment.failed', function(response) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'error',
                    data: response.error
                  }));
                });
                rzp.open();
              } catch (error) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'error',
                  data: { description: 'Failed to initialize payment' }
                }));
              }
            }

            // Start payment after a short delay to ensure WebView is ready
            setTimeout(initPayment, 1000);
          </script>
        </body>
      </html>
    `;
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      switch (data.type) {
        case 'success':
          setShowRazorpay(false);
          onSuccess(data.data.razorpay_payment_id);
          break;
        case 'error':
          setShowRazorpay(false);
          onError({
            description: data.data.description || 'Payment failed. Please try again.'
          });
          break;
        case 'dismiss':
          setShowRazorpay(false);
          onError({ description: 'Payment cancelled' });
          break;
        default:
          console.log('Unhandled message type:', data.type);
      }
    } catch (error) {
      setShowRazorpay(false);
      onError({ description: 'Payment failed' });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePayment}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Pay ₹{amount.toFixed(2)}</Text>
      </TouchableOpacity>

      <Modal
        visible={showRazorpay}
        onRequestClose={() => {
          setShowRazorpay(false);
          onError({ description: 'Payment cancelled' });
        }}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <WebView
            source={{ html: generateOrderHtml() }}
            onMessage={handleMessage}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
          />
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0070BA" />
              <Text style={styles.loadingText}>Initializing payment...</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#0070BA',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0070BA',
  },
});

export default RazorpayPayment;

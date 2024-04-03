if (window.ethereum) {
    // detect Metamask account change
    window.ethereum.on('accountsChanged', function (accounts) {
        console.log('accountsChanges',accounts);
        window.location.href = "/public";
    });

    // detect Network account change
    window.ethereum.on('chainChanged', function(networkId){
        console.log('networkChanged',networkId);
        changeNetwork();
    });

    changeNetwork();

}

async function connectToMetaMask() {
    if (window.ethereum) {
        try {
            window.web3 = new Web3(window.ethereum);
            // Request MetaMask access
            await window.ethereum.enable(); // Request account access
            console.log('Connected to MetaMask');
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            return signer;
        } catch (error) {
            console.log('Please install MetaMask to interact with Ethereum');
            console.error("Error connecting to MetaMask:", error);
            throw error;
        }
    } else if (window.web3) {
        // For deprecated versions of MetaMask
        window.web3.eth.sendAsync = function () {
            window.web3.currentProvider.send.apply(
                window.web3.currentProvider,
                arguments
            );
        };

        const provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
        const signer = provider.getSigner();
        return signer;
    } else {
        throw new Error("MetaMask not found");
    }
}

async function changeNetwork() {
    const networks = {
            1: "ETHEREUM MAINNET",
            5: "GOERLI TESTNET",
            59602: "REDEECASH EXCHANGE LOCALNET (TEST)"
        }
        window.ethereum.request({ method: 'net_version' })
        .then(networkId => {
            console.log("Network ID:", networkId);
            let networkName = networks[networkId];
            if (typeof networkName === 'undefined') networkName = `OTHER BLOCKCHAIN ${networkId}`;
            localStorage.setItem("network",networkName);
            localStorage.setItem("networkId",networkId);
            if (document.getElementById("login-blockchain")) document.getElementById("login-blockchain").value = networkName;
            if (document.getElementById("network")) document.getElementById("network").innerHTML = networkName;
            //getEthereumAccountBalance();
        })
        .catch(error => {
            console.error("Error retrieving network ID:", error);
        });                
}

async function getEthereumAccountBalance(wallet) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    const networkId = localStorage.getItem("networkId");
    const network = ["live","test","goerli"];

    fetch(`/account/balance/${wallet}?blockchain=${network[networkId]}`, requestOptions)
    .then((response) => response.json())
    .then(function(result){
        console.log(result.balance);
        document.getElementById("ether_balance").innerHTML = `${result.balance} ETH`;
    })
    .catch((error) => console.error(error));  
}

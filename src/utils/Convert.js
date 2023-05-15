export const ethToWei = (ethAmount) => {
    return window.web3.utils.toWei(ethAmount, 'Ether');
};

export const weiToEth = (weiAmount) => {
    return window.web3.utils.fromWei(weiAmount, 'Ether');
};


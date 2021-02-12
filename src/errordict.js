export default type => {

    const errorMessages = {
        "no_key": 'your key for API is not registered. Please check "Settings for Easy Content Analysis".',
        "no_content": 'There are not any sentences typed in Paragraph Block.'
    }

    const errorLog = {
        "status": '',
        "message": errorMessages[type],
    }

    return {
        "error": true,
        "log": errorLog,
    }
}
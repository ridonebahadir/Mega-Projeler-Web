mergeInto(LibraryManager.library, {
    ReturnToIndex: function() {
        window.top.location.href = '/index.html';
    },
    
    GoToScreen: function(screenName) {
        var screen = UTF8ToString(screenName);
        window.top.location.href = '/' + screen;
    }
});
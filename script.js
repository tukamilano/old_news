document.getElementById("get-news").addEventListener("click", function() {
    var url = "https://news.yahoo.co.jp/";
    var now = new Date();
    var tenYearsAgo = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate());

    // うるう年の場合、2月29日を2月28日に調整
    if (tenYearsAgo.getMonth() === 1 && tenYearsAgo.getDate() === 29) {
        tenYearsAgo.setDate(28);
    }

    var targetTimestamp = tenYearsAgo.toISOString().replace(/[-T:\.Z]/g, "").slice(0, 14);

    var apiUrl = "https://archive.org/wayback/available?url=" + encodeURIComponent(url) + "&timestamp=" + targetTimestamp;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.archived_snapshots && data.archived_snapshots.closest) {
                var archiveUrl = data.archived_snapshots.closest.url;
                var archiveTimestamp = data.archived_snapshots.closest.timestamp;
                var archiveDatetime = new Date(archiveTimestamp.slice(0, 4) + "-" + archiveTimestamp.slice(4, 6) + "-" + archiveTimestamp.slice(6, 8));

                if (Math.abs(archiveDatetime - tenYearsAgo) <= 86400000) { // 1日以内
                    window.location.href = archiveUrl;
                } else {
                    alert("指定された日付から1日以内の適切なスナップショットが見つかりませんでした。");
                }
            } else {
                alert("指定されたタイムスタンプのスナップショットが見つかりませんでした。");
            }
        })
        .catch(error => {
            console.error("エラーが発生しました:", error);
            alert("データの取得中にエラーが発生しました。");
        });
});
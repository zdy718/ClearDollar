DECLARE @UserId nvarchar(100) = 'demo-user';

-- 1) Delete transactions first (FK dependency)
DELETE FROM Transactions
WHERE UserId = @UserId;

-- 2) Delete tags
DELETE FROM Tags
WHERE UserId = @UserId;
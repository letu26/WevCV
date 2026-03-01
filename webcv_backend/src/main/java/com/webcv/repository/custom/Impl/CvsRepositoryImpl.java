package com.webcv.repository.custom.Impl;

import com.webcv.repository.custom.CvsRepositoryCustom;
import com.webcv.request.admin.GetAllCvsRequest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CvsRepositoryImpl implements CvsRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;


    public static void queryNomal(GetAllCvsRequest request, StringBuilder where){
        Long lastID = request.getLastID();
        Long size = request.getSize();
        String status = request.getStatus();
        String keyword = request.getKeyword();
        if(status != null && !status.trim().isEmpty()){
            where.append(" AND c.status = :status ");
        }
        if(lastID != null){
            where.append(" AND c.id > :lastID ");
        }
        if (keyword != null && !keyword.trim().isEmpty()) {
            where.append(" AND LOWER(c.title) LIKE LOWER(:keyword) ");
        }
        where.append(" ORDER BY c.id ASC ");
        if(size != null){
            where.append(" LIMIT :size ");
        }
    }
    @Override
    public List<Object[]> findAllCvs(GetAllCvsRequest request) {
        StringBuilder sql = new StringBuilder(" SELECT c.id, c.title, c.layout, c.blocks, c.status FROM cvs c ");
        StringBuilder where = new StringBuilder(" WHERE 1 = 1 AND deleted = false ");
        queryNomal(request, where);
        sql.append(where);

        Query query = entityManager.createNativeQuery(sql.toString());

        if (request.getStatus() != null && !request.getStatus().trim().isEmpty()) {
            query.setParameter("status", request.getStatus());
        }
        if (request.getLastID() != null) {
            query.setParameter("lastID", request.getLastID());
        }

        if (request.getKeyword() != null && !request.getKeyword().trim().isEmpty()) {
            query.setParameter("keyword", "%" + request.getKeyword().trim() + "%");
        }

        if (request.getSize() != null) {
            query.setParameter("size", request.getSize());
        }
        return query.getResultList();
    }
}